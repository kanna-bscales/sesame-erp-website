Customer-owned inventory tracking is one of the first things that breaks when a co-packer grows. Brand owners send their own ingredients, packaging or labels, you store them next to your own stock, and both are used on the same lines. The materials look the same on the shelf, but they belong to different companies, and each customer expects you to account for every pallet it sent.

This guide explains how co-packers and contract manufacturers can track toll and consigned materials in practice: what to record on receipt, how to record usage and waste for each run, and how to reconcile and report balances. It goes deeper into one topic from our guide to [ERP for co-packers and contract manufacturers](/blog/erp-for-co-packers-contract-manufacturers), which covers the full list of requirements.

## What are toll and consigned materials?

In a turnkey arrangement you buy the materials, make the product and invoice the finished goods. In a toll or consigned arrangement the customer supplies some or all of the materials and you charge for the work. Those materials usually remain the customer's property under your agreement, even while they sit in your warehouse.

Many plants run both arrangements at once, sometimes for the same customer: the customer supplies printed packaging while you buy the ingredients. That mix is what makes tracking difficult. The question is not only "how much do we have?" but "how much do we have, and whose is it?"

## Why ownership must be recorded on every lot

If ownership exists only in people's heads or in a separate spreadsheet, four problems follow:

- **Wrong use.** One customer's material is used for another customer's order, or for your own product.
- **Disputes.** A customer's count does not match yours, and nobody can show which runs used the difference.
- **Slow traces.** When a customer-supplied lot has a problem, you cannot quickly list the finished lots that contain it.
- **Unreliable stock figures.** Reports mix what you own with what you hold for others, so purchasing and finance work from the wrong numbers.

Brand owners also have to answer to their own customers. For example, the Proprietary Product Suppliers Addendum in 7-Eleven's official [Vendor/Supplier Guidelines](https://www.7-eleven.com/legal/vendor-supplier-guidelines), which covers suppliers of 7-Eleven's own-brand (proprietary) products, requires those suppliers to keep records documenting their use of co-packers or third-party manufacturers. A brand owner can only keep records like these if its co-packer can supply them.

## Customer-owned inventory tracking: what to record on every lot

The basic rule is simple: the owner is part of the lot record, not a note beside it. For each lot you receive, record:

- **Owner:** your company, or the named customer.
- **Item and customer item number:** your code and the customer's code for the same material.
- **Lot number:** the supplier's or customer's lot, plus your internal lot if you assign one.
- **Quantity and unit:** as received, with any difference from the customer's shipping document.
- **Dates:** received date and expiry or best-before date where it applies.
- **Status:** available, on hold or rejected.
- **Location:** where it is stored.

With the owner on the lot, your system can enforce the rule that matters most: a customer-owned lot can only be issued to that customer's orders.

## Receiving customer-supplied materials

Receiving is where most errors start, because customer materials often arrive without a purchase order from you. A workable process looks like this:

1. **Expect it.** Ask customers to send an advance notice of what they are shipping, and record it as an expected receipt against that customer.
2. **Check it.** Count and inspect on arrival, and compare with the customer's document.
3. **Record it with its owner.** Receive each lot into stock as owned by the customer, at the quantity you actually counted.
4. **Report differences immediately.** Tell the customer about shortages, damage or wrong items on the day, with the receipt record attached.
5. **Hold what fails inspection.** A lot on hold cannot be issued to production until quality releases it.

**Example:** a customer says it sent 20 pallets of cartons and 19 arrive. Because the difference was recorded and reported on receipt, it does not turn into a dispute three months later.

## Usage, yield and waste for each run

Every production run should record what it consumed, by lot. For customer-owned materials, record four figures:

- **Issued:** the quantity sent to the line.
- **Used in good product:** the quantity the finished goods account for.
- **Waste:** setup losses, damage and rejects, with a reason.
- **Returned:** unused quantity put back into stock, still under the customer's ownership.

Agree with each customer in advance what waste is expected for each product, so that normal losses and unusual ones can be told apart. When the actual waste on a run is higher than the agreed allowance, the system should flag it while people still remember what happened.

Recording consumption by lot also gives you traceability. One search should show which finished lots contain a given customer-supplied lot and where they were shipped.

## Reconciliation and stock reports

For every customer-owned item, one equation should always hold:

> Opening balance + receipts − used in good product − waste − returns to the customer = closing balance

Reconcile on a regular schedule and after every physical count. When the equation does not balance, the lot records show where to look: a receipt not entered, a run that used more than it recorded, or stock in the wrong location.

Then report to each customer, in its own item numbers. A useful customer stock report shows, by item and lot:

| Column | What it shows |
| --- | --- |
| Opening balance | Stock held at the start of the period |
| Received | Each receipt with date and document number |
| Used | Quantity consumed, by production run |
| Waste | Quantity lost, with the reason |
| Closing balance | Stock held at the end of the period |
| Expiry | Lots close to their expiry or best-before date |

**Example:** every Monday each customer receives a report of its stock at your plant, generated from the system rather than typed up by hand. Questions that used to take a day of searching are answered by the report.

## Accounting: agree the treatment with your accountant

Tracking ownership is an operational task; how customer-owned materials are treated in your accounts is a separate question. It depends on your agreements with each customer and on the accounting rules that apply to your business, so agree the treatment with your accountant. What the ERP should provide is reliable information: quantities by owner, movements by period and the agreement each lot belongs to. This article is general information, not accounting advice.

## What your ERP should do

- Record an owner on every lot, and prevent a customer-owned lot from being issued to another customer's order.
- Receive materials from customers without a purchase order, against an expected receipt.
- Record issued, used, waste and returned quantities for each run, by lot.
- Compare actual waste with the allowance agreed with the customer.
- Produce stock and usage reports per customer, using the customer's item numbers.
- Trace a customer-supplied lot to the finished lots and shipments that contain it.
- Keep customer-owned stock out of your own purchasing and valuation reports, or show it separately.

When you test a system, ask the vendor to show one customer-supplied material being received, consumed in a run and reported back to that customer. Many packaged systems handle parts of this; where yours does not, customer stock reporting is a common candidate for a custom module. Our guide to [packaged ERP vs custom ERP modules](/blog/packaged-erp-vs-custom-erp) explains how to make that decision process by process.

## Common mistakes

- **Tracking ownership by location only.** A "customer A" rack works until a pallet is put in the wrong place.
- **Recording usage in total, not by lot.** The balance may be right, but the trace is lost.
- **Leaving waste unrecorded.** Unexplained differences build up until the next count.
- **Reporting only when asked.** Regular reports find problems while they are still small.
- **Keeping the customer's records in a separate spreadsheet.** Two sets of figures will disagree sooner or later.

## Conclusion

Customer-owned inventory is manageable when ownership is recorded on every lot, usage and waste are recorded for every run, and balances are reconciled and reported on a schedule. The same records protect your customers' property, shorten disputes and make traces faster.

SesameERP builds custom ERP systems with AI agents built in, designed around how your plant works. If you hold materials for several customers and want one reliable view of who owns what, [talk to us about your ERP requirements](/contact).
