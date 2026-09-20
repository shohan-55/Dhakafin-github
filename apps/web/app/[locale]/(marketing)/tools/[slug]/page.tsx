import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ToolShell } from '@/components/tools/ToolShell';
import { CtaBand, FaqSection, Section } from '@/components/marketing/Sections';
import { LocaleLink } from '@/components/system/LocaleLink';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { toolOrder, tools as toolRegistry, isToolSlug, toolHref } from '@/lib/content/tools';
import { services } from '@/lib/content/services';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { isRateFree } from '@/lib/rates';
import { getToolDefinition } from '@/lib/tools/definitions';
import { buildMetadata } from '@/lib/seo';

/**
 * Tool detail — DF-P2-011, blueprint §5.5.2.
 * ---------------------------------------------------------------------------
 * One route for thirteen tools. The shell, the disclosure, the error states and
 * the accessibility behaviour are identical across them because they are the
 * same component; only the definition, the copy and the formula differ.
 *
 * `dynamicParams = false` because the layout above this route declares
 * `force-static`, and under static rendering a `notFound()` thrown from the page
 * cannot set the response status — an unknown tool slug would answer 200 with the
 * not-found body, and search engines would index it. Letting the router decide
 * gives a real 404. It is safe here because this segment has no optional
 * catch-all for the setting to suppress.
 */

export const dynamicParams = false;

export const generateStaticParams = () =>
  ['en', 'bn'].flatMap((locale) =>
    toolOrder.map((tool) => ({ locale, slug: tool.slug })),
  );

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  if (!isToolSlug(slug)) return {};
  const dict = getDictionary(locale);
  const copy = dict.tools.tools[slug];
  return buildMetadata({
    locale,
    path: toolHref(slug),
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

/**
 * The formula, written out for the "How this was calculated" disclosure and for
 * the held-back state. Kept as plain arithmetic text rather than an expression
 * tree: a reader checking the tool against their own calculation needs to read
 * it, not evaluate it.
 */
const FORMULAS: Record<string, { en: string; bn: string }> = {
  'tds-calculator': {
    en: 'deduction = payment amount × rate ÷ 100; net payable = amount − deduction',
    bn: 'কর্তন = পেমেন্টের অঙ্ক × হার ÷ ১০০; নিট = অঙ্ক − কর্তন',
  },
  'vds-calculator': {
    en: 'retention = bill amount × rate ÷ 100; net payable = bill − retention',
    bn: 'আটকানো = বিলের অঙ্ক × হার ÷ ১০০; নিট = বিল − আটকানো',
  },
  'vat-calculator': {
    en: 'exclusive: vat = base × rate · inclusive: base = gross ÷ (1 + rate); net payable = vat − input credit',
    bn: 'এক্সক্লুসিভ: ভ্যাট = ভিত্তি × হার · ইনক্লুসিভ: ভিত্তি = মোট ÷ (১ + হার); নিট = ভ্যাট − ইনপুট ক্রেডিট',
  },
  'income-tax-calculator': {
    en: 'tax = sum over slabs of (income in slab × slab rate); less rebate, subject to the minimum tax floor',
    bn: 'কর = প্রতিটি স্ল্যাবের (স্ল্যাবের আয় × স্ল্যাবের হার) যোগফল; রিবেট বাদ, সর্বনিম্ন করের তল সাপেক্ষে',
  },
  'corporate-tax-calculator': {
    en: 'tax = taxable profit × class rate, adjusted for the conditions attached to that rate',
    bn: 'কর = করযোগ্য মুনাফা × ধরনভিত্তিক হার, সেই হারের সাথে বাঁধা শর্তের সমন্বয়সহ',
  },
  'profit-calculator': {
    en: 'gross profit = revenue − cost of goods; operating profit = gross profit − operating expenses',
    bn: 'গ্রস মুনাফা = আয় − বিক্রীত পণ্যের ব্যয়; পরিচালন মুনাফা = গ্রস মুনাফা − পরিচালন ব্যয়',
  },
  'profit-margin-calculator': {
    en: 'margin = (price − cost) ÷ price; markup = (price − cost) ÷ cost; price at target = cost ÷ (1 − target)',
    bn: 'মার্জিন = (দাম − খরচ) ÷ দাম; মার্কআপ = (দাম − খরচ) ÷ খরচ; লক্ষ্য অনুযায়ী দাম = খরচ ÷ (১ − লক্ষ্য)',
  },
  'break-even-calculator': {
    en: 'break-even units = fixed costs ÷ (price − variable cost); revenue = units × price',
    bn: 'ব্রেক-ইভেন ইউনিট = স্থায়ী খরচ ÷ (দাম − পরিবর্তনশীল খরচ); আয় = ইউনিট × দাম',
  },
  'roi-calculator': {
    en: 'roi = net return ÷ investment; annualised = (total return ÷ investment)^(1 ÷ years) − 1',
    bn: 'ROI = নিট রিটার্ন ÷ বিনিয়োগ; বার্ষিকীকৃত = (মোট রিটার্ন ÷ বিনিয়োগ)^(১ ÷ বছর) − ১',
  },
  'cash-flow-calculator': {
    en: 'closing balance = opening + month net, carried forward; runway = opening ÷ average monthly burn',
    bn: 'শেষের ব্যালান্স = শুরুর + মাসের নিট, ধারাবাহিকভাবে; রানওয়ে = শুরুর ব্যালান্স ÷ গড় মাসিক খরচ',
  },
  'working-capital-calculator': {
    en: 'working capital = current assets − current liabilities; cycle = inventory days + receivable days − payable days',
    bn: 'ওয়ার্কিং ক্যাপিটাল = চলতি সম্পদ − চলতি দায়; চক্র = মজুত দিন + প্রাপ্য দিন − পরিশোধযোগ্য দিন',
  },
  'cost-efficiency-calculator': {
    en: 'avoidable cost = category spend × benchmark range, weighted by the process risk score',
    bn: 'সাশ্রয়যোগ্য ব্যয় = খাতভিত্তিক ব্যয় × বেঞ্চমার্ক পরিসর, প্রক্রিয়ার ঝুঁকির স্কোর দিয়ে ভারিত',
  },
  'payroll-calculator': {
    en: 'cost = headcount × (gross + allowances + overtime) + employer contribution',
    bn: 'খরচ = জনবল × (বেতন + ভাতা + ওভারটাইম) + নিয়োগকর্তার চাঁদা',
  },
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = resolveLocale(rawLocale);
  if (!isToolSlug(slug)) notFound();

  const dict = getDictionary(locale);
  const copy = dict.tools;
  const tool = copy.tools[slug];
  const registry = toolRegistry[slug];
  const definition = getToolDefinition(slug);
  const formula = (FORMULAS[slug] ?? { en: '', bn: '' })[locale === 'bn' ? 'bn' : 'en'];

  const relatedService = services[registry.crossSell];
  const siblings = toolOrder
    .filter((t) => t.category === registry.category && t.slug !== slug)
    .slice(0, 2);

  /* FAQPage schema. §5.5.4 #5 requires it on every tool page. */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  /* SoftwareApplication schema — the tool is the thing being described. */
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: tool.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' },
    featureList: definition.inputs.map((i) => tool.fields[i.id]?.label ?? i.id),
  };

  return (
    <main id="main" className="df-container py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <Breadcrumb
        items={[
          { label: 'DhakaFin', href: localeHref(locale, '/') },
          { label: copy.hub.allToolsLabel, href: localeHref(locale, '/tools') },
          { label: tool.name },
        ]}
        label={copy.hub.toolsNavLabel}
      />

      <header className="mt-8 max-w-3xl">
        <h1 className="text-h1 font-semibold text-[var(--df-color-text-strong)]">{tool.name}</h1>
        <p className="mt-4 text-body-lg leading-relaxed text-muted">{tool.tagline}</p>
        {/* §5.5.4 #5: a 40–60 word answer block at the top of every tool page. */}
        <p className="mt-5 text-sm leading-relaxed text-[var(--df-color-text)]">{tool.answer}</p>
      </header>

      <div className="mt-12">
        <ToolShell
          slug={slug}
          copy={tool}
          shell={copy.shell}
          disclosure={copy.disclosure}
          pendingCopy={copy.pending}
          locale={locale}
          rateFree={isRateFree(registry.rateFamilies)}
          formula={formula}
        />
      </div>

      {/* §5.5.4 #5 requires a visible disclaimer on every tool page. */}
      <p className="mt-8 max-w-3xl border-l-2 border-[var(--df-color-border-strong)] ps-4 text-xs leading-relaxed text-muted">
        {copy.disclaimer}
      </p>

      <Section id="how" title={tool.howItWorks.heading}>
        <div className="max-w-3xl space-y-5">
          {tool.howItWorks.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body leading-relaxed text-[var(--df-color-text)]">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section id="examples" title={tool.examples.heading}>
        <ul className="grid gap-4 md:grid-cols-2">
          {tool.examples.items.map((example) => (
            <li key={example.title}>
              <Card tone="quiet" padding="lg" className="h-full">
                <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                  {example.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{example.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Related links. §5.5.3 asks for three: a rate page, a tool and a service. */}
      <Section id="related" title={copy.related.heading}>
        <ul className="grid gap-4 md:grid-cols-3">
          {siblings.map((sibling) => (
            <li key={sibling.slug}>
              <LocaleLink
                locale={locale}
                href={toolHref(sibling.slug)}
                className="group block h-full no-underline"
              >
                <Card tone="quiet" padding="lg" interactive className="h-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                    {copy.related.toolLabel}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--df-color-text-strong)]">
                    {copy.tools[sibling.slug].name}
                  </p>
                </Card>
              </LocaleLink>
            </li>
          ))}

          <li>
            <LocaleLink
              locale={locale}
              href={`/services/${relatedService.slug}`}
              className="group block h-full no-underline"
            >
              <Card tone="quiet" padding="lg" interactive className="h-full">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                  {copy.related.serviceLabel}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--df-color-text-strong)]">
                  {dict.services.items[relatedService.slug].name}
                </p>
              </Card>
            </LocaleLink>
          </li>

          {/* The rate page this tool depends on, while it does not exist yet. */}
          <li>
            <Card tone="quiet" padding="lg" className="h-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                {copy.related.rateLabel}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="regulatory" glyph="◷">
                  {copy.index.pendingBadge}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{copy.related.ratePendingNote}</p>
            </Card>
          </li>
        </ul>
      </Section>

      <FaqSection
        id="faq"
        title={tool.faqs.heading}
        items={tool.faqs.items.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
        }))}
      />

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primary, href: localeHref(locale, '/book-consultation') }}
        secondary={{ label: copy.cta.secondary, href: localeHref(locale, '/services') }}
      />
    </main>
  );
}
