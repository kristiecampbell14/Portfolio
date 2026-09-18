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
      year: "2011",
      title: "Job Title",                            // TODO
      company: "Company Name",
      dates: "2011 – 2014",
      points: [
        "Key accomplishment or responsibility.",
        "Key accomplishment or responsibility.",
        "Key accomplishment or responsibility."
      ]
    },
    {
      year: "2014",
      title: "UX Designer",                          // TODO
      company: "Company Name",
      dates: "2014 – 2017",
      points: [
        "Key accomplishment or responsibility.",
        "Key accomplishment or responsibility.",
        "Key accomplishment or responsibility."
      ]
    },
    {
      year: "2017",
      title: "Senior UX Designer",
      company: "Company Name",
      dates: "2017 – 2020",
      points: ["Key accomplishment.", "Key accomplishment.", "Key accomplishment."]
    },
    {
      year: "2020",
      title: "Lead Product Designer",
      company: "Company Name",
      dates: "2020 – 2023",
      points: ["Key accomplishment.", "Key accomplishment.", "Key accomplishment."]
    },
    {
      year: "2023",
      title: "Design Manager",
      company: "Company Name",
      dates: "2023 – Present",
      points: ["Key accomplishment.", "Key accomplishment.", "Key accomplishment."]
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
