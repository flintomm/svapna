# Privacy and Terms: proposed changes

Draft for review. Nothing here is published. The current pages stay live until this is approved.
Written to match the existing pages' voice. Not legal advice: the points marked **DECIDE** are the owner's to settle, ideally with a lawyer, before sign-in or payment opens.

---

## Why the pages need changing

The current pages describe a site that was read-mostly: three forms, an analytics ping and a donation widget, with "no account system". Since then the site has gained:

- answers, stickers and a light or night preference saved in the visitor's own browser
- accounts with Google sign-in (built, not yet open)
- a planned one-time, pay-what-you-like membership through Stripe
- the Globe of Thought: passages by named authors, linked to their sources, with draft readings

---

## PRIVACY: changes

### Opening paragraph: replace with

> The Svapna Project is a free, donation-supported site about consciousness: the big questions people have asked for four thousand years, and the history and practice of dreaming. Most of the site is read without leaving a trace. Where it keeps or receives data — choices saved in the browser, an optional account, three small forms, an analytics ping, a payment — the policy below describes what is collected, why, where it travels, and how long it stays.

### "What is collected, and why": add these items

> **Choices saved in the browser.** Answers to the questions, stickers earned, the circles those answers lean toward, the light or night setting and the colour palette of the visit are saved in the browser's own storage on the visitor's device. They are not sent to the site or to anyone else unless the visitor signs in. Clearing the browser's site data removes them.

> **An account, when one is created.** Signing in is optional and uses Google. Google tells the site an email address and a unique identifier for the account; the Google name and picture are not copied or shown. The account then holds: the email address, a display name if the member chooses one, the member's answers to the questions, the stickers earned, a country if the member gives one, and whether a membership has been paid for. On first sign-in, answers and stickers already saved in the browser are copied into the account. Accounts are stored with Supabase.

> **A membership payment, when one is made.** **[Not yet live.]** Membership is a single payment of an amount the member chooses. Payment is taken by Stripe on Stripe's own pages. The site never sees or stores card details. Stripe tells the site that a payment succeeded, its amount and the account it belongs to. The amount is not shown to other members.

### "What is collected, and why": replace the last paragraph ("No account system…") with

> No behavioural advertising, no data sold to anyone, ever. Members cannot see one another's profiles or answers. When features that let members see or speak to one another are added, this policy is updated first to describe what becomes visible and to whom.

### "How long it is kept": add

> Browser storage: until the visitor clears it.
> Account data: until the member deletes the account. "Delete my account" on the member's page removes the account and everything stored with it at once; nothing is kept back. Accounts unused for **[DECIDE: 24 months?]** may be removed after a warning to the account's email address.
> Payment records: held by Stripe under Stripe's retention schedule and as tax law requires; the site keeps only the fact, date and amount of a payment against the account.

### "Who it is shared with": add to the list of third parties

> **Supabase** — stores accounts, answers and stickers, and handles sign-in. Data is held in the United States (AWS, Oregon).
> **Google** — confirms a member's identity at sign-in. Google learns that the member signed in to Svapna. Fonts are also loaded from Google Fonts, which receives the visitor's IP address as any web request does.
> **Stripe** — takes membership payments. **[Not yet live.]**

Remove Buy Me a Coffee from this list if and when donations move to Stripe.

### "International transfers": add

> Account data is stored in the United States. Visitors elsewhere who create an account are sending that data to the United States.

### "Cookies and storage": replace with

> The site sets no advertising or tracking cookies. It uses the browser's local storage for the choices described above. When a visitor signs in, Supabase's sign-in library keeps a session token in local storage so the member stays signed in; signing out removes it.

### "Rights of the data subject": add

> A member can see everything the account holds on the member's own page, change the display name there, and delete the account there without writing to anyone.

### "Children": replace with

> The site is written for adults. Accounts are not offered to anyone under **[DECIDE: 16 is the cautious choice; 13 is the usual minimum in the United States]**. An account found to belong to someone younger is removed.

---

## TERMS: changes

### "2. What the site is": replace with

> The site has two parts. The Globe of Thought gathers short passages in which thinkers answered large questions, each quoted from a linked source and placed on a scale. Dreaming presents the history and practice of dream work across the traditions and the sleep laboratory. Both are free to read.

### New section: "Passages and readings"

> Every quoted passage links to the source where its words can be read, and was checked against that source by machine. Where a passage sits on a scale, why, and what it does not show are the site's own readings. They are drafts, not yet reviewed by an editor, and are not a verdict on any author's whole work. Matches, circles and stickers are computed from those readings and from a visitor's answers; they are offered as an invitation to read further, not as a description of what anyone believes.
> Passages are quoted briefly for comment and study, with credit and a link. An author or rights holder who wants a passage corrected or removed can write to the contact address.

### New section: "Accounts"

> An account is optional. One person, one account. The member is responsible for what is done with it. A display name must not impersonate another person or be chosen to offend. The operator may remove an account that breaks these terms. A member may delete their account at any time.

### New section: "Membership" **[Not yet live]**

> Membership is a single payment, of an amount the member chooses from a stated minimum. It is not a subscription and does not renew. It opens the community features of the site for as long as the site runs them; it is not a purchase of the site's content, which stays free to read.
> **[DECIDE: refunds.]** Suggested: "A payment is refunded in full on request within 14 days, no reason needed. After that it is not refundable. Membership ends if it is refunded."
> The operator may end a membership for a serious or repeated breach of these terms, in which case **[DECIDE: refund or no refund]**.
> The site is not a registered nonprofit. Payments are not tax-deductible.

### "5. Donations": revise when Buy Me a Coffee is replaced

> Gifts are taken through **[Stripe]** and are voluntary. They buy nothing and are not refundable except where a payment was made in error.

### "6. Acceptable use": add

> Do not create accounts by automated means, attempt to read or change another member's data, or interfere with the questions' results by submitting answers that are not one's own.

### "12. Governing law"

> **[DECIDE: confirm the jurisdiction stated on the current page still applies now that the site takes payments.]**

---

## Decisions needed before this can be published

1. **Minimum age** for an account: 13 or 16.
2. **Refund policy** for membership: 14 days no-questions, or another rule.
3. **Inactive accounts:** remove after 24 months with a warning, or keep indefinitely.
4. **Who "the operator" is** for payments: an individual or a registered business. This appears on Stripe receipts and matters for tax.
5. **Governing law** now that money changes hands.

## What I have not checked

- Whether the site needs an EU representative, a cookie notice for local storage, or registration for sales tax or VAT. These depend on where members and buyers live and on advice I cannot give.
- Stripe's and Supabase's current terms, which the final wording should not contradict.
