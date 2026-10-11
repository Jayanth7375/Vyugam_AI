const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');

// GET /api/public/announcements (Public ticker & banners)
router.get('/announcements', (req, res) => {
  try {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10').all();
    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch announcements' });
  }
});

// GET /api/public/live-stats (Public stats banner: total teams, PS count, prize pool)
router.get('/live-stats', (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        totalTeams: 0,
        totalSubmissions: 0,
        totalStudents: 0,
        totalProblemStatements: 0,
        prizePool: '0',
        collegesParticipating: '0'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch live stats' });
  }
});

// GET /api/public/pages/about (Dedicated About Us page content)
router.get('/pages/about', (req, res) => {
  try {
    res.json({
      success: true,
      page: {
        slug: 'about',
        title: 'What is VyugamAI?',
        badge: 'DEPARTMENT OF ARTIFICIAL INTELLIGENCE & DATA SCIENCE',
        institution: 'Sri Eshwar College of Engineering',
        headline: 'Ideas × Intelligence × Impact',
        paragraphs: [
          'VyugamAI is a premier nationwide initiative designed to engage students in solving some of the most pressing challenges faced in everyday life. Launched to foster a culture of innovation and practical problem-solving, VyugamAI provides a dynamic platform for students to develop and showcase their creative solutions to real-world problems. By encouraging participants to think critically and innovatively, the hackathon aims to bridge the gap between academic knowledge and practical application.',
          'Since its inception, VyugamAI has garnered significant success in promoting out-of-the-box thinking among young minds, particularly engineering students from across India. Each edition has built on the previous one, refining its approach and expanding its impact. The hackathon not only offers students an opportunity to showcase their skills but also encourages collaboration with industry experts, government agencies, and other stakeholders.'
        ],
        mission: 'To cultivate a national hub of deep-tech innovation where young engineers transform conceptual AI and engineering theories into tangible, high-impact societal solutions.',
        vision: 'To pioneer student-driven research and entrepreneurship by connecting academia with frontier technology industries and national digital missions.',
        pillars: [
          {
            title: 'Practical Problem Solving',
            desc: 'Tackling real-world challenges curated by industry pioneers, government bodies, and social enterprises.',
            tag: 'Real-world Focus'
          },
          {
            title: 'Industry & Jury Mentorship',
            desc: 'Direct interaction and guidance from senior AI researchers, tech leads, and venture investors.',
            tag: 'Expert Mentorship'
          },
          {
            title: 'Incubation & Grand Prizes',
            desc: 'Cash awards, startup incubation pathways, and intellectual property support for winning teams.',
            tag: 'Ecosystem Backing'
          }
        ],
        highlights: [
          { label: 'Organized By', value: 'Dept. of AI & Data Science' },
          { label: 'Host Institution', value: 'Sri Eshwar College of Engineering' },
          { label: 'Eligibility', value: 'Engineering & Tech Students Nationwide' },
          { label: 'Finale Format', value: '36-Hour Offline Hackathon' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch about page' });
  }
});

// GET /api/public/pages/process (Dedicated Project Implementation & Roadmap page content)
router.get('/pages/process', (req, res) => {
  try {
    res.json({
      success: true,
      page: {
        slug: 'process',
        title: 'Project Implementation & Roadmap',
        subtitle: 'From Idea Inception to the 36-Hour Physical Grand Finale',
        phases: [
          {
            step: 'Phase 01',
            title: 'Team Formation & Idea Submission',
            date: 'Extended: 25th October 2026',
            status: 'Active',
            desc: 'Form teams of 2 to 4 students, choose a problem statement, and upload your PPT proposal highlighting problem definition, proposed AI/Tech architecture, and feasibility.'
          },
          {
            step: 'Phase 02',
            title: 'Round 1 Jury Screening & Shortlisting',
            date: 'Early November 2026',
            status: 'Upcoming',
            desc: 'Blind evaluation by internal and external academic juries to select top teams per track based on originality and algorithmic rigor.'
          },
          {
            step: 'Phase 03',
            title: 'Virtual Mentorship & Prototype Build',
            date: 'Late November 2026',
            status: 'Upcoming',
            desc: '1-on-1 virtual mentoring clinics with industry specialists to refine system architectures, datasets, and API integrations.'
          },
          {
            step: 'Phase 04',
            title: 'Grand Finale (36-Hour Offline Hackathon)',
            date: 'December 2026 / January 2027',
            status: 'Grand Finale',
            desc: 'Top finalist teams assemble on campus at Sri Eshwar College of Engineering for live coding, continuous jury reviews, and stage demos.'
          }
        ],
        rubrics: [
          { criteria: 'Originality & Innovation', weight: '25%' },
          { criteria: 'AI & Technical Complexity', weight: '25%' },
          { criteria: 'Practical Feasibility & Scalability', weight: '20%' },
          { criteria: 'UI/UX & User Experience', weight: '15%' },
          { criteria: 'Demo Defense & Q&A Pitch', weight: '15%' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch process page' });
  }
});

// GET /api/public/pages/faq (Dedicated FAQs page content)
router.get('/pages/faq', (req, res) => {
  try {
    res.json({
      success: true,
      page: {
        slug: 'faq',
        title: "Got Questions? We've Got Answers.",
        subtitle: 'Everything you need to know about VyugamAI 2026 participation, team rules, and timelines.',
        categories: ['All', 'General', 'Teams & Eligibility', 'Submissions & Rules', 'Grand Finale'],
        faqs: [
          {
            category: 'General',
            question: 'What is VyugamAI 2026?',
            answer: 'VyugamAI 2026 is a premier national innovation hackathon organized by the Department of Artificial Intelligence and Data Science at Sri Eshwar College of Engineering, challenging students to build breakthrough AI, software, and hardware solutions.'
          },
          {
            category: 'Teams & Eligibility',
            question: 'What is the team size and composition?',
            answer: 'Teams must consist of 2 to 4 members. Inter-departmental and inter-year teams within the same college or multi-disciplinary collaborations are enthusiastically encouraged.'
          },
          {
            category: 'Teams & Eligibility',
            question: 'Who is eligible to participate?',
            answer: 'Undergraduate and postgraduate students pursuing engineering, technology, computer science, and data disciplines from recognized colleges across India.'
          },
          {
            category: 'Submissions & Rules',
            question: 'What is the PPT submission format?',
            answer: 'Submissions must include problem statement code, executive summary, methodology flowchart, dataset/architecture schema, and expected impact using the official VyugamAI template.'
          },
          {
            category: 'General',
            question: 'Is there any registration fee?',
            answer: 'Initial round registration and proposal submission is completely free. Shortlisted finalists will receive accommodation and amenities at Sri Eshwar campus.'
          },
          {
            category: 'Grand Finale',
            question: 'Where will the Grand Finale take place?',
            answer: 'The Grand Finale is a 36-hour physical hackathon hosted at the state-of-the-art Innovation Center, Sri Eshwar College of Engineering, Coimbatore.'
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch faq page' });
  }
});

// GET /api/public/pages/contact (Dedicated Contact page content)
router.get('/pages/contact', (req, res) => {
  try {
    res.json({
      success: true,
      page: {
        slug: 'contact',
        title: 'Helpdesk & Contact Center',
        subtitle: 'Our organizing committee is here to assist with team nominations, registration, and queries.',
        headquarters: {
          campus: 'Sri Eshwar College of Engineering',
          center: 'Innovation Cell, Department of AI & DS, Block A',
          address: 'Kondampatti Post, Vadasithur via, Kinathukadavu',
          city: 'Coimbatore - 641 202, Tamil Nadu, India'
        },
        phone: '+91 94899 99999',
        email: 'hackathon@sece.ac.in',
        timings: 'Monday to Saturday: 9:00 AM – 7:00 PM IST',
        whatsappDesk: 'https://wa.me/919489999999'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch contact page' });
  }
});

// GET /api/public/pages/:slug (Dynamic dispatcher)
router.get('/pages/:slug', (req, res) => {
  const { slug } = req.params;
  const redirectMap = {
    'about': '/api/public/pages/about',
    'process': '/api/public/pages/process',
    'faq': '/api/public/pages/faq',
    'contact': '/api/public/pages/contact'
  };

  if (redirectMap[slug]) {
    return res.redirect(redirectMap[slug]);
  }

  res.status(404).json({ success: false, error: `Page '${slug}' not found` });
});

// POST /api/public/contact (Submit contact helpdesk message)
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const id = 'msg-' + uuidv4().slice(0, 8);
    db.prepare(`
      INSERT INTO contact_messages (id, name, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, email, subject || 'General Query', message);

    res.status(201).json({ success: true, message: 'Message sent successfully. Our team will get back to you.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

module.exports = router;
