import { Octokit } from "@octokit/rest";
import { OpenAIApi, Configuration } from "openai";
import nodemailer from "nodemailer";

const main = async () => {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const pull_number = process.env.PR_NUMBER;
  const github_key = process.env.GITHUB_TOKEN;

  const openai_key = process.env.OPENAI_SECRET;
  const email = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;

  const users = [
    "harshilpradhan@simformsolutions.com",
    "muskan.m@simformsolutions.com",
    "harsh.s@simformsolutions.com",
    "jay.patel@simformsolutions.com",
    "tarun.a@simformsolutions.com",
    "nikunj.v@simformsolutions.com",
    "alpesh.r@simformsolutions.com",
    "kairavi.s@simformsolutions.com",
  ];

  let input = "";

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: openai_key,
    })
  );

  const client = new Octokit({
    auth: github_key,
  });

  const { data: commits } = await client.pulls.listCommits({
    owner,
    repo,
    pull_number,
  });

  const prNumbers = commits
    ?.map(({ commit }) => {
      const match = commit?.message?.match(/#(\d+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  for (let i = 0; i < prNumbers.length; i++) {
    const prNumber = prNumbers[i];

    try {
      const {
        data: { title, body },
      } = await client.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });

      const prDescription = !!body ? `\nPR Description: ${body}` : "";
      const content = `PR Title: ${title} ${prDescription} \n\n\n`;

      input += `${content} \n\n`;
    } catch (e) {
      continue;
    }
  }

  if (!input) {
    throw new Error("Cannot generate notes with empty input.");
  }

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Prepare release notes from following PR info. It should be a single list with bullet points. Segregate the list for new Features, Bug fixes and improvements. Place result in HTML list tags. \n ${input}`,
      },
    ],
  });

  if (!result.data?.choices?.[0]?.message?.content) {
    throw new Error("Response not generated from OpenAI API.");
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
  });

  transport.sendMail(
    {
      to: users,
      subject: `A new version is released for project ${owner}/${repo}`,
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Software Release Notes</title>
          <style>
            /* Set default font family and size */
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
            }
            
            /* Header styles */
            .header {
              background-color: #007bff;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            
            h2, h3, h4, h5, h6 {
              font-size: 18px;
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
            }
            li {
              margin-bottom: 5px;
              font-size: 16px;
            }
            
            /* Footer styles */
            .footer {
              background-color: #f2f2f2;
              color: #999999;
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><code>${repo}</code> Software Release Notes</h1>
          </div>
      <p>Dear User,</p>
      <p>We are excited to announce the release of a new version of <code>web app</code>. Please find below the detailed release note.</p>
      ${result.data?.choices?.[0]?.message?.content}
      <p><a href="https://github.com/${owner}/${repo}" target="_blank">Click here</a> for more information about the current release.
    <div class="footer">
    This release note was generated automatically by OpenAI <code>gpt-3.5-turbo</code> model.
  </div>
    </body>
  </html>`,
    },
    (e, i) => {
      if (!!e) {
        consoe.log(e);
      }
      if (!!i) {
        console.log("Email sent successfully!");
      }
    }
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
