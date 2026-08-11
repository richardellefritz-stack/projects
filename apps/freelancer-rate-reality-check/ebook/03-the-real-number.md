# Chapter 3: The Real Number

This chapter is arithmetic. It takes about ten minutes and a piece of paper. Do it by hand at least once, even if you plan to use the calculator afterward, because understanding the shape of the calculation is what lets you defend the number later.

We're solving for two figures:

- **Your floor** — the rate below which the work is not worth doing. Not a target. A floor.
- **Your target** — the floor plus the margin that makes this a business rather than a treadmill.

## Step 1: What do you need to actually live on?

Start with your real annual cost of living. Rent or mortgage, food, transport, insurance, debt payments, the irregular things that reliably happen — car repairs, dental work, the wedding you have to fly to.

Do not use your last salary. Use what your life costs.

Call this number **L**.

Most people undershoot here because they budget for a good month and forget that the year contains bad ones. If you have twelve months of bank statements, use them; if you don't, add 10% to whatever you first wrote down.

## Step 2: What does the business cost?

Now, separately, everything you spend to be able to do the work at all. Software subscriptions. Hardware and replacement cycles. Professional insurance. Accounting. Website and domain. Professional development. Health coverage, if you're buying it yourself — and this is often the largest single line, so don't wave at it.

Call this number **B**.

A freelancer with a modest tool stack and self-funded health coverage can easily be looking at a five-figure annual business cost. Write down the real number even if it's unpleasant.

## Step 3: Gross up for tax

This is the step almost everyone skips, and it's why the earlier method fails.

**L + B** is what you need the business to *deliver*. It is not what you need to *bill*, because a substantial portion of what you bill goes to tax before it reaches you.

As a freelancer you carry the whole self-employment tax burden — both the portion an employee pays and the portion an employer normally pays on their behalf — and then income tax on top. The combined effective rate varies enormously by jurisdiction, income level, entity structure, and what you can legitimately deduct, so I'm not going to give you a precise figure and pretend it applies to you.

What I'll give you is the mechanic. Pick your best estimate of your combined effective tax rate as a decimal — call it **T** — and gross up:

```
Required revenue = (L + B) ÷ (1 − T)
```

Note the division. This is the part people get wrong: you cannot just add your tax rate on top. If you need $60,000 to reach you and you're taxed at 30%, you don't need $78,000 — you need roughly **$85,700**, because the tax applies to the larger number too. Adding instead of dividing undershoots by thousands.

If you have no idea what to use for **T**, use a placeholder to see the shape of the answer, then get a real figure from an accountant before you commit to anything. This is exactly the kind of number worth paying someone for.

Call the result **R** — required annual revenue.

## Step 4: How many hours can you actually bill?

We covered why this isn't 40 in Chapter 2. Now put a number on it.

```
Billable hours per year = (billable hours per week) × (working weeks per year)
```

For most freelancers, honest values land around **20–30 billable hours per week** and **48–50 working weeks per year**. If you're brand new and still spending most of your time on marketing and setup, use the bottom of that range or below it. If you have a stable book of retained clients and very little pitching, you can justify the top.

What you may not do is write 40 and 52.

Call the result **H**.

At 25 hours across 48 weeks, **H = 1,200**. Notice how far that is from 2,080. That gap is the entire reason a rate that looked fine on paper leaves you working constantly and still short.

## Step 5: Your floor

```
Floor rate = R ÷ H
```

That's it. That's the number below which you are, in a literal sense, paying for the privilege of working.

### A worked example

Someone with a $55,000 cost of living, $9,000 in annual business costs, an estimated 28% effective tax rate, billing 25 hours a week across 48 weeks:

```
L + B          = $64,000
R              = $64,000 ÷ (1 − 0.28)  = $88,889
H              = 25 × 48               = 1,200 hours
Floor rate     = $88,889 ÷ 1,200       ≈ $74/hour
```

Seventy-four dollars an hour — to support a life costing fifty-five thousand.

If that number startled you, that reaction is the point of this chapter. Someone in this position charging $45/hour isn't running a slightly-thin business. They're running a business that cannot cover its own costs, and the shortfall is being absorbed by savings, a partner's income, unpaid overtime, or deferred expenses like retirement contributions and health coverage they've decided to skip.

## Step 6: Your target

The floor covers costs. It builds nothing. A business that exactly breaks even has no capacity to absorb a slow quarter, a client who doesn't pay, a piece of equipment dying, or a month off.

Add a margin — **15–30%** over the floor is a reasonable band, and lean toward the higher end if your income is lumpy or your client base is concentrated in a few relationships.

```
Target rate = Floor rate × 1.20   (for a 20% margin)
```

In the worked example: $74 × 1.20 ≈ **$89/hour**.

That margin isn't greed. It's the difference between a business and a job with worse benefits.

## Billed rate vs. effective rate

One more distinction, because it explains a specific and demoralizing experience.

Your **billed rate** is what's on the invoice. Your **effective rate** is what you actually clear, per hour you actually worked — including all the hours nobody paid you for.

```
Effective rate = (annual revenue − tax − business costs) ÷ total hours worked
```

Run that on the worked example and the person billing $89/hour is clearing something in the neighborhood of $30–$35 per hour of actual work, once you divide by every hour they spent — billable and not. Aggregated figures put this gap at roughly **35–45%** below the billed rate for typical freelancers, and the example lands squarely in that range.

This is why quoting a rate that sounds enormous compared to an hourly wage doesn't feel enormous when the money arrives. You are not comparing like with like. An employee's $35/hour comes with an employer paying half their payroll tax, funding their equipment, covering their health insurance, and paying them during meetings, training, holidays, and sick days. Your $89 has to cover all of that, out of fewer hours.

When a client, or your own internal critic, reacts to your rate as if it's a windfall — this is the answer. It isn't a wage. It's a rate that has to *become* a wage after everything is taken out of it.

## Now go get your number

> **Do this now, before Chapter 4.** The **Rate Reality Check calculator** runs everything above from the same inputs — cost of living, business costs, tax estimate, realistic hours — and returns your floor, your target, and your effective rate side by side, so you can see the gap rather than take my word for it. It also shows how your result compares to the going range for your category and experience tier, which is what the next chapter is about.
>
> Write down three numbers before you continue: **your floor, your target, and what you currently charge.**

That third number is the one that matters. The distance between it and the other two is the subject of the rest of this book.
