/* =====================================================================
   SITE CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit to fill out the site.

   PRODUCT STORIES
   Each story renders a card in the Work carousel and its own page at
   story.html?id=<slug>. A story is a list of `blocks`; each block has a
   `type` that decides its layout. See js/story.js for the renderer.

   Block types:
     figure     one image + caption        width: full | wide | narrow
     split      copy beside an artifact    ratio: 40-60 | 50-50 | 60-40, flip
     statement  a large pull statement plus supporting copy
     timeline   horizontal evolution strip of short nodes
     steps      a numbered progression (observed → tested → built → measured)
     metrics    a strip of numbers with labels
     annotated  one artifact plus short text callouts instead of fine print
     gallery    2-3 small artifacts side by side
     cards      2-3 text cards for decisions that weren't new screens
     impact     full-width forest band, huge numbers
     closing    narrow reading column that ends on one large line
     prose      a short centered paragraph to set up what follows
   ===================================================================== */

window.SITE = {
  name: "Kristie Campbell",
  email: "kristiecampbell14@gmail.com",
  linkedin: "https://www.linkedin.com/in/kristiecampbelldesign",

  /* -------------------------------------------------------------------
     CONTACT
     This fills both the Contact section at the foot of the page and the
     "?" node at the end of the resume timeline.
     ------------------------------------------------------------------- */
  contact: {
    heading: "What's next?",
    body:
      "That's the story so far. If you're building something that needs clarity, craft, and a lot of curiousity, I'd love to hear about it.",
    status: "Open to design leadership roles",
    emailLabel: "Say hello",
    linkedinLabel: "Connect on LinkedIn"
  },

  /* -------------------------------------------------------------------
     WORK PASSWORD
     Only a SHA-256 hash of the password is stored, not the password itself.
     Current password: 6026906250
     To change it, open the site, run this in the browser console:
       await sha256Hex("your new password")
     and paste the result below.
     ------------------------------------------------------------------- */
  workPasswordHash: "c250fadffe78d0615e8f4bdbf03986f490581f6efd1ed05b5b0c8e5fb0164217",

  /* -------------------------------------------------------------------
     PRODUCT STORIES
     ------------------------------------------------------------------- */
  stories: [
    /* =================================================================
       JOB EXPLORER
       ================================================================= */
    {
      slug: "job-explorer",
      title: "Job Explorer",
      eyebrow: "0→1 product · 2021–2026",
      headline: "Rethinking job search for people who don't know what to search for.",
      intro:
        "I led Job Explorer from its first release through five years of continuous evolution, creating a personalized, searchless way for working adults to discover relevant opportunities based on their program, skills, preferences, and career goals.",

      /* card in the Work carousel */
      role: "Lead product designer",
      year: "2021–2026",
      tagline: "A job feed with no search bar, for people who don't know what to type.",
      cover: "assets/stories/job-explorer/cover.png",
      accent: "forest",

      facts: [
        { label: "Role", value: "Lead / sole product designer" },
        { label: "Team", value: "Product trio: PM + tech lead + engineering" },
        { label: "Responsibilities", value: "Discovery, research, experimentation, UX/UI" },
        { label: "Impact", value: ["10K+ monthly unique users", "6% → 25% Apply Now conversion"] }
      ],

      next: {
        slug: "career-profile",
        bridge:
          "The personalization behind Job Explorer depended on understanding the person behind the search."
      },

      blocks: [
        {
          type: "figure",
          width: "full",
          image: "assets/stories/job-explorer/cover.png", w: 1920, h: 1080,
          alt:
            "The mature Job Explorer page: Career Plan, remote, city and experience-level filters above a column of job cards showing skill-match counts and save hearts, beside a full job description with Apply now and Generate resumé actions.",
          caption:
            "The mature Job Explorer experience: personalized recommendations, user-controlled filters, saved jobs, skills matching and Career Plan alignment—without keyword search."
        },

        {
          type: "split",
          ratio: "40-60",
          heading: "The problem wasn't search. It was knowing what to search for.",
          body:
            "Before Job Explorer, students were sent to a third-party job board that was buried in the experience and offered little personalization.\n\nUser interviews revealed something more fundamental: many people didn't know what job title to type into a search field. They searched broad concepts like “remote” or “entry level” because they knew the conditions they wanted, but not necessarily the career they were looking for.\n\nThat changed our question from “How do we improve job search?” to “How do we help someone discover relevant opportunities without requiring them to know what to search for?”",
          image: "assets/stories/job-explorer/initial-launch.png", w: 998, h: 1044,
          alt:
            "The first Job Explorer release: a single remote-jobs toggle, job cards listing possible skills for each job, and a job description with an Apply now button.",
          caption: "The first release matched jobs to a student's program and self-identified skills."
        },

        {
          type: "statement",
          heading: "I made a deliberate bet on searchless discovery.",
          quote:
            "A search bar doesn't improve the outcome when the user doesn't know what to search for.",
          body:
            "The absence of search was controversial. UX leadership repeatedly questioned whether a job feed could work without it. I defended the model because adding keyword search would have shifted the burden back to the user instead of solving the problem we had observed.\n\nThe alternative was harder: make the system underneath the feed increasingly good at understanding the user. Five years later, it still has no search bar."
        },

        {
          type: "timeline",
          heading: "Five years of making a simple experience smarter",
          nodes: [
            "Program + skills",
            "Filters + preferences",
            "Saved jobs",
            "Talent Source",
            "Career Plan alignment",
            "Connected job system"
          ]
        },

        {
          type: "split",
          ratio: "50-50",
          heading: "Searchless discovery created a new problem.",
          subhead: "People could find a great job—and then struggle to find it again.",
          body:
            "During interviews, I watched people try to show me a job they had seen previously and fail to locate it again. Without keyword search, the product needed a way for users to preserve opportunities they wanted to return to.\n\nBefore asking engineering to build the backend, we tested desirability with a false-door experiment. We added save hearts to job cards and descriptions and measured how often people interacted with them, and where.",
          image: "assets/stories/job-explorer/save-falsedoor.jpg", w: 814, h: 322,
          alt:
            "A job description header with an Apply now button and a Save heart beside it, used as the false-door test.",
          caption:
            "The false door: a save affordance on job cards and descriptions, instrumented before any backend existed."
        },

        {
          type: "steps",
          items: [
            { label: "Observed", body: "Users could not relocate jobs they had already found." },
            { label: "Tested", body: "A false-door save interaction on cards and descriptions." },
            { label: "Built", body: "Saved Jobs became a production feature." },
            { label: "Measured", body: "Saved-job users showed stronger Apply Now behavior." }
          ]
        },

        {
          type: "metrics",
          items: [
            { value: "~20%", label: "Average Career Navigator Apply Now" },
            { value: "~34%", label: "Apply Now among users who saved a job" }
          ],
          note: "Observed FullStory cohort behavior; not a controlled causal experiment."
        },

        {
          type: "annotated",
          heading: "The product became something we continuously observed.",
          body:
            "Job Explorer wasn't designed through a single research phase and then handed off. We regularly interviewed users, watched sessions in FullStory, and built quantitative dashboards to evaluate releases, identify friction, and decide where to investigate next.",
          align: "center",
          video: "assets/stories/job-explorer/Dashboard Zoom_JobExplorer.mp4", w: 1280, h: 720,
          alt:
            "A screen recording panning across the Job Explorer FullStory dashboard: Apply Now conversion, saved-job behavior, job-card engagement and error tracking.",
          callouts: [
            "Apply Now conversion",
            "Saved-job behavior",
            "Job-card engagement",
            "Errors / experience health"
          ],
          kicker: "The dashboard didn't tell us what to design. It told us where to look."
        },

        {
          type: "cards",
          heading: "Some of the most important decisions weren't new screens.",
          items: [
            {
              title: "Filters without recreating search",
              body:
                "I pushed to add user-controlled filters and used false-door methods to learn which controls mattered before investing in full functionality."
            },
            {
              title: "Making Talent Source understandable",
              body:
                "Talent Source opportunities initially included a large legal disclosure. Interviews showed users couldn't explain what made those jobs different. I worked with Legal to preserve required disclosure while replacing the wall of text with clearer hierarchy, illustrations, and storytelling."
            },
            {
              title: "Accessibility as part of product development",
              body:
                "The earliest version predated a mature accessibility partnership. Over time, I worked directly with the ADA team so new components and changes were evaluated from design through development."
            }
          ]
        },

        {
          type: "figure",
          width: "wide",
          image: "assets/stories/job-explorer/final-design.png", w: 714, h: 798,
          alt:
            "Job Explorer showing a Talent Source job card with a photo header, Talent Match and Tuition Benefit badges, and a job description explaining that the employer invites candidates with these skills to apply.",
          caption:
            "Talent Source in place: a photo-led card, plain-language Talent Match and Tuition Benefit badges, and the disclosure rewritten as hierarchy instead of a wall of legal text."
        },

        {
          type: "annotated",
          heading: "Eventually, Job Explorer stopped being just a page.",
          body:
            "As Job Explorer matured, its job-card and job-description patterns became reusable components that could surface opportunities throughout the Career Navigator ecosystem.\n\nInstead of redesigning jobs for every new context, we created a connected design language so improvements could cascade across products.",
          image: "assets/stories/job-explorer/figma-job-cards.png", w: 1410, h: 1273,
          alt:
            "A Figma component sheet showing job card variants: contents, selectable cards in default, hover and focus states, standalone cards, and Talent Source cards with imagery.",
          caption:
            "The job card as a component set: standard and selectable variants, Talent Source cards with imagery, and one shared skill treatment running through all of them."
        },

        {
          type: "figure",
          width: "wide",
          image: "assets/stories/job-explorer/figma-job-description.png", w: 1600, h: 883,
          alt: "A Figma component sheet for the reusable job description layout and its variants.",
          caption: "The job description, rebuilt as a component so any product could host a posting."
        },

        {
          type: "figure",
          width: "narrow",
          image: "assets/stories/job-explorer/miro-inventory.png", w: 1400, h: 819,
          alt:
            "A Miro board inventorying every job card and job posting pattern found across the product suite.",
          caption:
            "Cross-team inventory used to consolidate job patterns into a shared component model."
        },

        {
          type: "impact",
          heading: "Five years of iteration changed the outcome.",
          primary: { value: "6% → 25%", label: "Apply Now conversion across Job Explorer's evolution" },
          secondary: [{ value: "10K+", label: "monthly unique users" }],
          body:
            "Apply Now became a recurring business KPI because it represented a measurable step toward career progression. Job Explorer also became the student-facing destination for Talent Source opportunities, supporting new B2B partnerships and expanding the role of the product beyond direct-to-student job discovery."
        },

        {
          type: "closing",
          heading: "What I would have built next",
          body:
            "The next opportunity was deeper algorithmic personalization.\n\nAs Career Profile, Career Plan, and the broader product family gave us richer signals about the user, I wanted Job Explorer to become increasingly capable of ranking the right opportunities without asking the user to do more work.",
          end: "Ask less. Understand more. Show better opportunities."
        }
      ]
    },

    /* =================================================================
       CAREER PROFILE
       ================================================================= */
    {
      slug: "career-profile",
      title: "Career Profile",
      eyebrow: "0→1 product · 2021–2026",
      headline: "A trophy case of skills became the data layer for an entire product suite.",
      intro:
        "I inherited a third-party skills dashboard and rebuilt it into Career Profile: one place where working adults could see everything they bring to the table, and the source of the data that made every other career product personal.",

      role: "Lead product designer",
      year: "2021–2026",
      tagline: "One place to keep your career data, and many places it pays off.",
      cover: "assets/stories/career-profile/career-profile-final.png",
      accent: "vibrant",

      facts: [
        { label: "Role", value: "Lead / sole product designer" },
        { label: "Team", value: "Product trio: PM + tech lead + engineering" },
        { label: "Responsibilities", value: "Discovery, research, experimentation, UX/UI" },
        { label: "Impact", value: ["11.9K monthly users", "36.2K monthly skills page hits"] }
      ],

      next: {
        slug: "ai-resume",
        bridge:
          "Once the profile knew the person, the next product could ask them for almost nothing."
      },

      blocks: [
        {
          type: "figure",
          width: "full",
          image: "assets/stories/career-profile/career-profile-final.png", w: 1320, h: 1268,
          alt:
            "The mature Career Profile: a portfolio nav for skills, work history, education and resume, a skills panel split into UOPX and self-identified skills, an active career milestone card, and a row of job cards aligned to the user's skillset.",
          caption:
            "The mature Career Profile: skills, work history, education, resumé, preferences and saved items in one place—feeding Job Explorer and Career Plan from a single source."
        },

        {
          type: "split",
          ratio: "40-60",
          heading: "It started as somebody else's duct tape.",
          body:
            "When I joined in 2021, a third-party “skills dashboard” was the business's first attempt at showing how programs mapped to skills. It was held together with duct tape, and it only knew about skills earned at the university.\n\nThat left out the thing our users had the most of. These were working adults who arrived with years of experience, and none of it counted anywhere in the experience.\n\nMy first assignment was to improve that dashboard. What I argued for instead was rebuilding it next to Job Explorer, so a user could see their skills and what those skills were worth in the same place.",
          image: "assets/stories/career-profile/skills-dashboard-before.png", w: 910, h: 1547,
          alt:
            "The original third-party skills dashboard, listing course skills as demonstrated, not demonstrated, or to be evaluated.",
          caption:
            "Before: a course-by-course skills dashboard, disconnected from work experience and from any next step."
        },

        {
          type: "statement",
          quote: "Skills only matter if the user believes an employer cares about them.",
          body:
            "The hardest questions at the start weren't layout questions. Did people know what a skill was? Did they care? And what would make them willing to add more?\n\nThat last one mattered commercially. Using FullStory, we could correlate profile depth with behavior: users with 10 or more skills on their profile were more likely to click Apply Now in Job Explorer. Profile completeness wasn't vanity data—it was the input that made recommendations good."
        },

        {
          type: "split",
          ratio: "50-50",
          flip: true,
          heading: "The first release was deliberately bare.",
          body:
            "Version one held self-identified skills only, but it did one important thing: those skills fed Job Explorer results. From the first release, adding a skill visibly changed what the product showed you.\n\nA later release combined university-earned skills with self-identified ones in a single view. I kept them visually distinct on purpose—university skills were evidence of what the user was paying for, and treating them differently gave them more weight.",
          image: "assets/stories/career-profile/skills-profile-first.png", w: 862, h: 1173,
          alt:
            "The first standalone skills profile: a three-column list of self-identified skills with an add/edit skills button, above cards for viewing jobs, getting career advice and updating a resumé.",
          caption: "The first standalone skills profile, launched alongside Job Explorer."
        },

        {
          type: "timeline",
          heading: "From a skills dashboard to a career profile",
          nodes: [
            "Third-party skills dashboard",
            "Self-identified skills profile",
            "University + self-identified combined",
            "Career Profile: work, education, resumé",
            "Connected to Job Explorer + Career Plan"
          ]
        },

        {
          type: "gallery",
          heading: "Bounce rate was the real problem, so we ran experiments instead of arguments.",
          body:
            "Many people visited to check whether new university skills had appeared, and then left. Rather than debate what would hold their attention, we tested the asks: a persona-based nudge, a prompt inside Job Explorer at the moment skills were clearly relevant, and a skills identifier that let people add skills by past job title instead of by name.",
          cols: 2,
          items: [
            {
              image: "assets/stories/career-profile/nudge-starter.jpg", w: 539, h: 354,
              alt: "A modal recommending that a “starter” persona add self-identified skills.",
              caption: "Persona-based nudges tailored the reason for adding skills."
            },
            {
              image: "assets/stories/career-profile/nudge-enhancer.jpg", w: 860, h: 593,
              alt: "The same modal written for an “enhancer” persona.",
              caption: "Same ask, different framing for someone already skills-aware."
            },
            {
              image: "assets/stories/career-profile/skills-nudge.jpg", w: 916, h: 564,
              alt:
                "A modal on Job Explorer asking whether the user wants to explore jobs more aligned to their skillset.",
              caption: "Asking inside Job Explorer, where the payoff was visible."
            },
            {
              image: "assets/stories/career-profile/skills-identifier.jpg", w: 849, h: 466,
              alt:
                "The Skills Identifier modal offering to add skills by job title or by name.",
              caption: "Adding skills by job title, for people who couldn't name their own skills."
            }
          ]
        },

        {
          type: "split",
          ratio: "50-50",
          heading: "Users wouldn't hand over data that only helped us.",
          body:
            "Work history was the clearest example. Asking someone to type in years of employment history produced very little, because nothing came back to them for the effort.\n\nTwo things changed that. Inferring skills from a job title turned the ask into a gift: tell us where you worked, and we'll tell you what you know. And once the resumé generator and Career Plan shipped, work history finally had an obvious payoff.",
          image: "assets/stories/career-profile/work-history-skills.jpg", w: 880, h: 555,
          alt:
            "The Career Profile work history form, suggesting related skills from the entered job title that can be added to the profile.",
          caption:
            "Enter a job title, get skills back—reciprocity in place of a data-entry request."
        },

        {
          type: "cards",
          heading: "The decisions I'd defend again.",
          items: [
            {
              title: "Separating university skills from self-identified",
              body:
                "I wanted these to feel different so university-earned skills carried more weight. It was a retention argument as much as a clarity one: staying enrolled visibly added to what you owned."
            },
            {
              title: "Removing the career-advising callout",
              body:
                "We tested a site stripe, an advisor card, and prompts to add skills. The advisor callout didn't earn its space in this experience, so I took it out rather than let the page accumulate asks."
            },
            {
              title: "Letting go of “upcoming skills”",
              body:
                "The old dashboard promised skills from future courses. The data didn't exist at scale in the new stack, so we shipped without it and partnered with a data team on the endpoints rather than fake it."
            }
          ]
        },

        {
          type: "annotated",
          heading: "The profile was monitored like a product, not a form.",
          body:
            "I kept a FullStory dashboard on Career Profile and used it to decide where to look next: which sections people actually used, where they dropped, and whether an experiment moved profile depth.",
          align: "center",
          video: "assets/stories/career-profile/Dashboard Zoom_Profile.mp4", w: 1280, h: 720,
          alt:
            "A screen recording panning across the Career Profile FullStory dashboard: navigation usage by section, profile and skills page hits, skill-count cohorts and experiment performance.",
          callouts: [
            "Navigation usage by section",
            "Profile users and skills page hits",
            "Skill-count cohorts",
            "Experiment performance"
          ],
          caption: "The whole dashboard, kept as a monitoring habit rather than a one-off readout."
        },

        {
          type: "impact",
          heading: "One place to update. Many places it paid off.",
          primary: { value: "11.9K", label: "monthly Career Profile users" },
          secondary: [
            { value: "36.2K", label: "monthly skills page hits" },
            { value: "10+", label: "skills correlated with higher Apply Now" }
          ],
          body:
            "Career Profile ended up tied with Job Explorer as the most visited product in the entire career suite. More importantly, it became the data layer underneath the others: prefilling the resumé generator, grounding Career Plan, and sharpening Job Explorer's recommendations. Users updated their career data once, and three products got better."
        },

        {
          type: "closing",
          heading: "What I would have built next",
          body:
            "The profile was finally rich enough to be predictive rather than descriptive.\n\nWith work history, education, skills and preferences in one place, the next step was letting the profile tell users what to do next—surfacing the gap between who they are today and the role they're aiming at, instead of waiting for them to go look.",
          end: "Ask once. Use it everywhere."
        }
      ]
    },

    /* =================================================================
       AI resumé GENERATOR
       ================================================================= */
    {
      slug: "ai-resume",
      title: "AI Resumé Generator",
      eyebrow: "0→1 AI product · 2025",
      headline: "The thing standing between our users and a job application was a document they didn't have.",
      intro:
        "The business believed students weren't applying to jobs because they hadn't graduated yet. Interviews said otherwise: they didn't have a resumé. I designed the first student-facing AI product at the university to remove that blocker, and it moved Apply Now further than anything else we shipped.",

      role: "Lead product designer",
      year: "2025",
      tagline: "The first student-facing AI product, aimed at the one blocker nobody had named.",
      cover: "assets/stories/ai-resume/resume-editor.png",
      accent: "mint",

      facts: [
        { label: "Role", value: "Lead / sole product designer" },
        { label: "Team", value: "Product trio: PM + tech lead + engineering" },
        { label: "Responsibilities", value: "Discovery, legal partnership, UX/UI, AI interaction" },
        { label: "Impact", value: ["55% Apply Now with a generic resumé", "72% with a tailored one"] }
      ],

      next: {
        slug: "job-explorer",
        bridge:
          "A resumé is only worth writing when there's already a job on the screen worth applying to."
      },

      blocks: [
        {
          type: "figure",
          width: "full",
          image: "assets/stories/ai-resume/resume-editor.png", w: 1381, h: 1266,
          alt:
            "The resumé generator editor: a contents nav for summary, work history, skills and education, a professional summary form with an AI enhancement control, and a live resumé preview with a download button.",
          caption:
            "The editor: prefilled from Career Profile, sectioned so people could work in pieces, with AI offered as an assist rather than an author."
        },

        {
          type: "statement",
          quote: "You can't apply to a job if you don't have a resumé.",
          body:
            "This opportunity came out of research for another product. While interviewing users about Job Explorer, my product trio kept hearing the same reason for not clicking Apply Now: “I just need to update my resumé.” Or they didn't have one at all.\n\nHistorically the business believed people didn't apply because they thought they had to wait for a degree. The interviews reframed it. Either the jobs weren't interesting—which Job Explorer's personalization was already attacking—or the user was blocked by a missing document. Before this, the only help on offer was a static Word template from a career advisor."
        },

        {
          type: "timeline",
          heading: "From a Word template to a tailored resumé",
          nodes: [
            "Static Word templates (Pre-2025)",
            "Generic job-title resumé (Aug 2025)",
            "100% scaled launch (Sep 2025)",
            "Tailored to a Job Explorer posting (Apr 2026)",
            "resumé-only skill control (Apr 2026)"
          ]
        },

        {
          type: "split",
          ratio: "50-50",
          heading: "Most people can't describe their own work.",
          subhead: "So we stopped asking them to write, and asked them to choose.",
          body:
            "The intake asks where you worked, then offers AI-drafted statements about that role for you to select. Recognition is far easier than composition, especially for someone who has never had to translate a job into resumé language.\n\nOne of my favorite fixes on this product had no UI at all. After launch I noticed that clicking “re-generate more items” returned near-duplicates of what the user had already seen. Nothing on screen needed to change; I took it to my engineers and made sure “generate more” genuinely generated new material. The interaction was only as good as what came back.",
          image: "assets/stories/ai-resume/resume-intake.png", w: 1400, h: 1123,
          alt:
            "The resumé intake at the job descriptions step, offering six AI-generated task statements for an Executive Assistant role, two of them selected, with a link to re-generate more items.",
          caption:
            "Choose up to six things you actually did, then refine later—selection instead of a blank field."
        },

        {
          type: "cards",
          heading: "Three decisions that shaped the product.",
          items: [
            {
              title: "The first question was the wrong one",
              body:
                "Version one opened by asking for a target job title—the exact thing our users had already told us they couldn't name. We lost people at step one. Showing saved job titles helped, but the friction was real and it's why tailoring to a specific posting mattered so much."
            },
            {
              title: "Skills you can hide without losing",
              body:
                "At launch, removing a skill from a resumé removed it from your profile. Not every skill belongs on every resumé, but deleting it shouldn't erase your record of it. With tailored resumés I finally separated the two: resumé-only skill control, profile untouched."
            },
            {
              title: "AI with legal in the room",
              body:
                "Using AI to draft summaries and job descriptions put us in front of Legal for the entire end-to-end flow. Borrower-defense exposure meant we could never imply a promised job or outcome. We landed on minimal disclaimers placed where they were needed instead of a wall of text."
            }
          ]
        },

        {
          type: "annotated",
          heading: "The funnel made the case better than any argument could.",
          body:
            "We compared Apply Now behavior for all Job Explorer visitors against the cohorts who downloaded a resumé, and then against those who downloaded one tailored to the posting they were looking at.",
          image: "assets/stories/ai-resume/applynow-funnel.png", w: 1089, h: 612,
          alt:
            "A FullStory conversion chart comparing Job Explorer Apply Now rates: 20.62% of all real users, 55.38% of users who downloaded a resumé, and 71.67% of users who downloaded a tailored resumé.",
          caption: "FullStory conversion comparison, past 30 days."
        },

        {
          type: "metrics",
          items: [
            { value: "~21%", label: "Apply Now, all visitors" },
            { value: "55%", label: "Apply Now with a generic resumé" },
            { value: "72%", label: "Apply Now with a tailored resumé" }
          ],
          rule: false,
          note: "Observed FullStory cohort behavior; not a controlled causal experiment."
        },

        {
          type: "annotated",
          heading: "Shipped, then watched.",
          body:
            "The resumé generator got its own dashboard from day one, so adoption, drop-off and download behavior were visible without waiting for a readout.",
          align: "center",
          video: "assets/stories/ai-resume/Dashboard Zoom_Resume.mp4", w: 1280, h: 720,
          alt:
            "A screen recording panning across the resumé generator FullStory dashboard: unique visitors, traffic over 90 days, and the engagement and download funnel cards.",
          callouts: [
            "Adoption and unique visitors",
            "Intake step drop-off",
            "Download completion",
            "Apply Now by cohort"
          ]
        },

        {
          type: "impact",
          heading: "The largest single move in Apply Now we ever made.",
          primary: { value: "72%", label: "Apply Now among users with a tailored resumé" },
          secondary: [
            { value: "55%", label: "with a generic resumé" },
            { value: "~21%", label: "baseline across all visitors" }
          ],
          body:
            "No other release moved Job Explorer's Apply Now rate this far. It confirmed the reframe the whole product rested on: the barrier was never belief or timing, it was a missing document. This was also the first student-facing AI product at the university, and it set the interaction and disclosure patterns that later AI tools followed."
        },

        {
          type: "closing",
          heading: "What I would have built next",
          body:
            "Adoption was the next problem. The tool worked far better than it was known, and awareness was where I'd have spent the following quarter.\n\nAfter that: a holistic review of the whole resumé rather than section-by-section assistance, multiple templates, and extending resumé-only control to work history and education the way we did for skills.",
          end: "Remove the blocker, and people move on their own."
        }
      ]
    }
  ],

  /* -------------------------------------------------------------------
     RESUME TIMELINE (oldest → newest)
     ------------------------------------------------------------------- */
  timeline: [
    {
      year: "2013",
      title: "Web Designer I",
      company: "GoDaddy",
      dates: "2013 – 2016",
      points: [
        "Produced websites for small business customers using Website Builder, Shopping cart, and WordPress",
        "Constantly evaluated internal team processes in an ever-changing environment and proposed new solutions to increase productivity",
        "Used HTML/CSS and Adobe Creative Suite to create custom experiences for customers who did not fit “in the box” of a template design"
      ]
    },
    {
      year: "2016",
      title: "Jr. UX/UI Designer",
      company: "University of Phoenix",
      dates: "2016 – 2017",
      points: [
        "Ideated with cross functional teams to create business and product solutions that are meaningful to users",
        "Created low/high-fidelity wireframes and working prototypes to test in a lab or virtual lab environment",
        "Defined user interactions in depth to product owners and developers for seamless hand-off"
      ]
    },
    {
      year: "2017",
      title: "Lead UX/UI Designer",
      company: "OpenTech Alliance",
      dates: "2017 – 2021",
      points: [
        "Led UX design and research efforts across the company on a multitude of projects including self-service kiosks, access control systems, and e-commerce websites",
        "Redesigned StorageTreasures.com to be a mobile-first experience while simultaneously rebranding for better ADA compliance and modernization and differentiation",
        "Redesigned and improved usability on a new version of customizable self-storage kiosks from start to finish, as well as a third new version exclusively for Public Storage"
      ]
    },
    {
      year: "2021",
      title: "Sr. UX/UI Designer",
      company: "University of Phoenix",
      dates: "2021 – 2024",
      points: [
        "Served as the design lead in a product trio, collaborating with the product manager and tech lead for career products that served 24,000+ students and alumni per month",
        "Owned the end-to-end user experience strategy for a suite of student facing products, including 0-1 products such as our Job Explorer, Career Profile, and AI Resumé Generator tools",
        "Led continuous discovery, research, design, and data efforts with real users via interviews, surveys, A/B tests, and integration with tools such as FullStory to gain a full picture with quantitative and qualitative data points"
      ]
    },
    {
      year: "2024",
      title: "Sr. UX Manager (player-coach)",
      company: "University of Phoenix",
      dates: "2024 – 2026",
      points: [
        "Led a team of 6 product centric senior UX designers and content writers to ensure a cohesive user experience in the B2B/careers space ",
        "Championed an agentic support agent, Super Phoebe, that spanned across multiple customer lifecycles and integrated with internal support for a seamless user experience",
        "Fostered and evolved AI adoption for the UX department in alignment with enterprise IT standards."
      ]
    }
  ],

  /* -------------------------------------------------------------------
     LINKEDIN RECOMMENDATIONS
     ------------------------------------------------------------------- */
  recommendations: [
    {
      quote:
        "What I value most about Kristie is how she leads. She cares deeply about her people, advocates fiercely for the user, and makes those around her better. She made a meaningful impact on our organization—and on me as a leader.",
      name: "Vera Springett",
      title: "Sr. UX Director, University of Phoenix",
      relation: "Managed Kristie"
    },
    {
      quote: "Kristie has an absolute ownership spirit, with a bleeding conviction to do right by her users, without compromising business objectives. Truly one of the best UX managers I have ever worked with.",
      name: "Benjamin Irwin",
      title: "Sr. Product Manager, University of Phoenix",
      relation: "Worked with Kristie"
    },
    {
      quote: "Kristie has strong UX judgment and taught me a great deal. She helped me use product analytics more effectively, think through design problems more critically, and make more informed design decisions. Her guidance continues to shape how I approach my work.",
      name: "Iftekhar Azam",
      title: "Sr. UX/UI Designer, University of Phoenix",
      relation: "Reported to Kristie"
    },
    {
      quote: "Her attention to detail and eye for design made translating prototypes fluid and painless. All in all she is a great collaborator who can work around UX and technical needs to put the best version of a product in front of users.",
      name: "Coby Swan",
      title: "Software Engineer II, University of Phoenix",
      relation: "Worked with Kristie"
    }
  ]
};
