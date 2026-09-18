/* =====================================================================
   SITE CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit to fill out the site.
   Anything marked TODO is placeholder copy.
   ===================================================================== */

window.SITE = {
  name: "Kristie Campbell",
  email: "kristiecampbell14@gmail.com.com",                       // TODO
  linkedin: "https://www.linkedin.com/in/kristiecampbelldesign", // TODO

  /* -------------------------------------------------------------------
     CONTACT
     This fills the "?" node at the end of the resume timeline, which
     replaced the old footer contact section.
     ------------------------------------------------------------------- */
  contact: {
    heading: "What's next?",
    body:
      "That's the story so far. If you're building something that needs clarity, craft, and a little rule-breaking, I'd love to hear about it.", // TODO
    status: "Open to design leadership roles", // small availability line; set to "" to hide
    emailLabel: "Say hello",
    linkedinLabel: "Connect on LinkedIn"
  },

  /* -------------------------------------------------------------------
     WORK PASSWORD
     Only a SHA-256 hash of the password is stored, not the password itself.
     Default password: structuredplay
     To change it, open the site, run this in the browser console:
       await sha256Hex("your new password")
     and paste the result below.
     ------------------------------------------------------------------- */
  workPasswordHash: "68bf526ac70f130a29aad0a58f641a81111ceeeb007e5fb7c5a8d7e45474b3d7",

  /* -------------------------------------------------------------------
     PROJECTS
     Each project shows as a card in the Work carousel and gets its own
     detail page at project.html?id=<slug>.
     Put images in assets/work/ and reference them by path.
     Leave `cover` empty ("") to show a branded placeholder.
     ------------------------------------------------------------------- */
  projects: [
    {
      slug: "project-one",
      title: "Job Explorer",                     // TODO
      role: "Design Lead",                           // TODO
      year: "2021-2026",
      tagline: "As a student/alum I need to know what jobs are available that align to my program, skills, and interests",
      cover: "assets/work/job-explorer-cover.png",                                     // e.g. "assets/work/project-one-cover.jpg"
      url: "careers.phoenix.edu/jobs",                    // shown in the browser mockup bar
      accent: "forest",                              // forest | vibrant | mint | charcoal
      meta: {
        Role: "Design Lead",
        Team: "5 engineers, 1 PM",
        Tools: "UXPin, Figma, FullStory, Jira"
      },
      overview:
        "A short paragraph that sets the scene: who the users were, what was broken, and why it mattered to the business.",
      sections: [
        {
          heading: "The challenge",
          body: "Describe the problem space. What constraints did you work within? What did success look like?",
          image: ""
        },
        {
          heading: "Process",
          body: "Walk through research, exploration and key decisions. Show the thinking, not just the output.",
          image: ""
        },
        {
          heading: "The solution",
          body: "Show the final design and explain why it works.",
          image: ""
        }
      ],
      outcomes: [
        { value: "+32%", label: "Task completion" },
        { value: "−40%", label: "Support tickets" },
        { value: "4.6★", label: "User rating" }
      ]
    },
    {
      slug: "project-two",
      title: "Project Name Two",
      role: "Senior UX Designer",
      year: "2024",
      tagline: "One sentence about the problem this project solved.",
      cover: "",
      url: "app.example.com",
      accent: "vibrant",
      meta: { Role: "Senior UX Designer", Timeline: "4 months", Team: "TODO", Tools: "TODO" },
      overview: "TODO: Project overview.",
      sections: [
        { heading: "The challenge", body: "TODO", image: "" },
        { heading: "Process", body: "TODO", image: "" },
        { heading: "The solution", body: "TODO", image: "" }
      ],
      outcomes: []
    },
    {
      slug: "project-three",
      title: "Project Name Three",
      role: "Design Systems",
      year: "2023",
      tagline: "One sentence about the problem this project solved.",
      cover: "",
      url: "system.example.com",
      accent: "mint",
      meta: { Role: "Design Systems Lead", Timeline: "TODO", Team: "TODO", Tools: "TODO" },
      overview: "TODO: Project overview.",
      sections: [
        { heading: "The challenge", body: "TODO", image: "" },
        { heading: "The solution", body: "TODO", image: "" }
      ],
      outcomes: []
    },
    {
      slug: "project-four",
      title: "Project Name Four",
      role: "UX / UI",
      year: "2022",
      tagline: "One sentence about the problem this project solved.",
      cover: "",
      url: "example.com",
      accent: "charcoal",
      meta: { Role: "TODO", Timeline: "TODO", Team: "TODO", Tools: "TODO" },
      overview: "TODO: Project overview.",
      sections: [{ heading: "The challenge", body: "TODO", image: "" }],
      outcomes: []
    }
  ],

  /* -------------------------------------------------------------------
     RESUME TIMELINE (oldest → newest)
     ------------------------------------------------------------------- */
  timeline: [
    {
      year: "2013",
      title: "Web Designer I",                            // TODO
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
      title: "Jr. UX/UI Designer",                          // TODO
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
        "Owned the end-to-end user experience strategy for a suite of student facing products, including 0-1 products such as our Job Explorer, Career Profile, and AI Resume Generator tools",
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
        "Led and monitored an ever expanding design system utilizing MUI as the base, while integrating heavily with the collaboration and direction of our ADA team across a large group of UX designers"]
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
