// Contact / join-our-network forms.
// POSTs JSON to /api/submit (api/submit.js), which forwards to Power Automate and adds a row to an Excel table
// (docs/form-to-excel-power-automate.md). PUBLIC_FORM_ENDPOINT can override the URL (e.g. Formspree).
// If the endpoint isn't set up yet or can't be reached, the visitor's email app opens with the details instead.

const ENDPOINT = (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined)?.trim() || '/api/submit';
const TO = 'info@ccastech.com';

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const seg = form.querySelectorAll<HTMLInputElement>('input[name=audience]');

  // "I'm hiring" / "I'm looking for a role" toggles which fields apply
  const applyAudience = () => {
    const v = (form.querySelector<HTMLInputElement>('input[name=audience]:checked') ?? form.querySelector<HTMLInputElement>('input[type=hidden][name=audience]'))?.value ?? 'hiring';
    form.querySelectorAll<HTMLElement>('[data-for]').forEach((el) => {
      const on = el.dataset.for === v;
      el.hidden = !on;
      el.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea').forEach((i) => (i.disabled = !on));
    });
  };
  const ta = form.querySelector<HTMLTextAreaElement>('textarea[data-ph-hiring]');
  const setPlaceholder = (v: string) => { if (ta) ta.placeholder = (v === 'seeking' ? ta.dataset.phSeeking : ta.dataset.phHiring) ?? ''; };
  seg.forEach((r) => r.addEventListener('change', () => { applyAudience(); setPlaceholder(r.value); }));
  applyAudience();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status'; status.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.website) return; // honeypot
    delete data.website;
    data.page = location.pathname;

    const viaEmail = () => {
      const lines = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
      const subject = data.audience === 'seeking' ? 'Consultant enquiry — CCAS Tech' : 'Talent request — CCAS Tech';
      location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      status.classList.add('ok');
      status.textContent = 'Your email app should open with the details filled in. If it does not, write to ' + TO + '.';
    };

    submit.disabled = true;
    const label = submit.innerHTML; submit.textContent = 'Sending…';
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      // Endpoint not deployed / not configured yet: don't lose the enquiry, hand it to the email app.
      if (res.status === 404 || res.status === 503) { viaEmail(); return; }
      if (!res.ok) throw new Error(String(res.status));
      form.reset(); applyAudience();
      status.classList.add('ok');
      status.textContent = 'Thanks — a specialist will reply within one business day.';
    } catch {
      status.classList.add('err');
      status.textContent = `Something went wrong sending that. Please email ${TO} directly.`;
    } finally {
      submit.disabled = false; submit.innerHTML = label;
    }
  });
});
