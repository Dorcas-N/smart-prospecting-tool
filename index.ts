import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const VIBE_API_KEY = Deno.env.get("VIBE_PROSPECTING_API_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { icp, language, limit } = await req.json();

    // Mock prospects for demo (replace with real Vibe API call)
    const mockProspects = [
      {
        id: "p1",
        name: "Marie Dupont",
        email: "marie.dupont@company.com",
        company: "TechCorp France",
        jobTitle: "Growth Manager",
        linkedinUrl: "https://linkedin.com/in/mariedupont",
        industry: "Technology",
        companySize: "50-200",
        location: "Paris, France",
        recentActivity: [
          {
            type: "post",
            title: "Just scaled our acquisition to 200 leads/day",
            date: "2 days ago",
          },
        ],
      },
      {
        id: "p2",
        name: "Jean Martin",
        email: "jean.martin@startup.com",
        company: "StartUp Growth",
        jobTitle: "Founder & Growth Hacker",
        linkedinUrl: "https://linkedin.com/in/jeanmartin",
        industry: "SaaS",
        companySize: "10-50",
        location: "Paris, France",
        recentActivity: [
          {
            type: "job_change",
            title: "Promoted to VP Growth",
            date: "1 week ago",
          },
        ],
      },
      {
        id: "p3",
        name: "Sophie Bernard",
        email: "sophie.bernard@agency.fr",
        company: "Marketing Agency Pro",
        jobTitle: "Digital Marketing Director",
        linkedinUrl: "https://linkedin.com/in/sophiebernard",
        industry: "Marketing & Advertising",
        companySize: "50-200",
        location: "Lyon, France",
        recentActivity: [
          {
            type: "company_news",
            title: "Agency raised €2M funding",
            date: "3 days ago",
          },
        ],
      },
      {
        id: "p4",
        name: "Alexandre Lefevre",
        email: "a.lefevre@fintech.fr",
        company: "FinTech Innovations",
        jobTitle: "VP Sales",
        linkedinUrl: "https://linkedin.com/in/alexandrelefevre",
        industry: "Financial Services",
        companySize: "50-200",
        location: "Lyon, France",
        recentActivity: [
          {
            type: "hiring",
            title: "Hiring 3 new sales development reps",
            date: "5 days ago",
          },
        ],
      },
      {
        id: "p5",
        name: "Isabelle Moreau",
        email: "i.moreau@ecommerce.fr",
        company: "E-Commerce Plus",
        jobTitle: "Customer Acquisition Manager",
        linkedinUrl: "https://linkedin.com/in/isabellemoreau",
        industry: "E-Commerce",
        companySize: "100-500",
        location: "Marseille, France",
        recentActivity: [
          {
            type: "article",
            title: "Published: The Future of E-Commerce Marketing",
            date: "1 week ago",
          },
        ],
      },
    ];

    // Generate more mock prospects
    const prospects = Array(limit || 15)
      .fill(null)
      .map((_, i) => {
        const base = mockProspects[i % mockProspects.length];
        return {
          ...base,
          id: `p${i + 1}`,
          name: `${base.name.split(" ")[0]} ${String.fromCharCode(65 + (i % 26))}`,
          email: `prospect${i + 1}@example.com`,
          score: 70 + Math.random() * 30,
        };
      });

    // TODO: Replace with actual Vibe Prospecting API call:
    /*
    const vibeResponse = await fetch('https://api.vibeprospecting.com/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VIBE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobTitles: icp.targetAudience.split(','),
        industries: icp.industries,
        companySize: icp.companySize,
        limit: limit || 15,
      }),
    });
    const prospects = await vibeResponse.json();
    */

    return new Response(
      JSON.stringify({ prospects }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to get prospects" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
