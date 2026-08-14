## Hi there 👋

  [Conference Room Schedule](https://dedicatedcloud.github.io/dedicatedcloud/conference-room-schedule.html).



  [Dynamic SVG Editor](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor.html).



  [Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor-two-lines.html).



  [Dynamic SVG Editor Pro +](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor-pro.html).



  [Bookmarklet Maker](https://dedicatedcloud.github.io/dedicatedcloud/bookmarklet.html).




[Tree To Shell](https://dedicatedcloud.github.io/dedicatedcloud/tree-to-shell.html).





[bookmarklet.html](https://dedicatedcloud.github.io/dedicatedcloud/bookmarklet.html).


[conference-room-schedule.html](https://dedicatedcloud.github.io/dedicatedcloud/conference-room-schedule.html).


[dynamic-svg-editor-pro.html](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor-pro.html).



[dynamic-svg-editor-two-lines.html](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor-two-lines.html).



[dynamic-svg-editor.html](https://dedicatedcloud.github.io/dedicatedcloud/dynamic-svg-editor.html).



[generate-save-to-repo-form.sh](https://dedicatedcloud.github.io/dedicatedcloud/generate-save-to-repo-form.sh).



[index.html](https://dedicatedcloud.github.io/dedicatedcloud/index.html).


[neon-custom-text.html](https://dedicatedcloud.github.io/dedicatedcloud/neon-custom-text.html).


[neon.html](https://dedicatedcloud.github.io/dedicatedcloud/neon.html).


[test.html](https://dedicatedcloud.github.io/dedicatedcloud/test.html).


[tree-to-shell.html](https://dedicatedcloud.github.io/dedicatedcloud/tree-to-shell.html).


[ybgr-screenshot.html](https://dedicatedcloud.github.io/dedicatedcloud/ybgr-screenshot.html).


[ybgr.html](https://dedicatedcloud.github.io/dedicatedcloud/ybgr.html)



## Index Dir

```
#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="index.htm"
TITLE="Index"

html_escape() {
    local s="${1:-}"
    s="${s//&/&amp;}"
    s="${s//</&lt;}"
    s="${s//>/&gt;}"
    s="${s//\"/&quot;}"
    s="${s//\'/&#39;}"
    printf '%s' "$s"
}

{
    printf '%s\n' '<!doctype html>'
    printf '%s\n' '<html lang="en">'
    printf '%s\n' '<head>'
    printf '%s\n' '  <meta charset="utf-8">'
    printf '%s\n' '  <meta name="viewport" content="width=device-width, initial-scale=1">'
    printf '  <title>%s</title>\n' "$(html_escape "$TITLE")"
    printf '%s\n' '  <style>'
    printf '%s\n' '    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.5; }'
    printf '%s\n' '    h1 { margin-bottom: 20px; }'
    printf '%s\n' '    ul { padding-left: 20px; }'
    printf '%s\n' '    li { margin-bottom: 8px; }'
    printf '%s\n' '    a { color: #0645ad; text-decoration: none; }'
    printf '%s\n' '    a:hover { text-decoration: underline; }'
    printf '%s\n' '  </style>'
    printf '%s\n' '</head>'
    printf '%s\n' '<body>'
    printf '  <h1>%s</h1>\n' "$(html_escape "$TITLE")"
    printf '%s\n' '  <ul>'

    find . -maxdepth 1 -type f \( -iname '*.html' -o -iname '*.htm' \) ! -iname 'index.html' ! -iname 'index.htm' -printf '%f\n' \
        | LC_ALL=C sort \
        | while IFS= read -r file; do
            escaped_file="$(html_escape "$file")"
            printf '    <li><a href="%s">%s</a></li>\n' "$escaped_file" "$escaped_file"
        done

    printf '%s\n' '  </ul>'
    printf '%s\n' '</body>'
    printf '%s\n' '</html>'
} > "$OUTPUT_FILE"

printf 'Created %s\n' "$OUTPUT_FILE"
```



<!--

[Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/
[Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/
[Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/
[Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/
[Dynamic SVG Editor 2 Lines](https://dedicatedcloud.github.io/dedicatedcloud/










# Hi there, I'm DedicatedCloud! ☁️












Welcome to my GitHub profile! I'm passionate about building scalable, reliable, and innovative cloud-based solutions. Whether it's automating workflows, contributing to open-source projects, or experimenting with new technologies, I'm always eager to learn and share knowledge.

---

## 🌟 About Me
- 💻 **Profession**: Cloud Architect | DevOps Enthusiast | Open Source Contributor
- 🌐 **Interests**: Cloud Computing, Automation, CI/CD, Infrastructure as Code
- 📚 **Learning**: Always exploring new tools and technologies in the cloud ecosystem
- 🎯 **Mission**: Empower developers and organizations to leverage the full potential of cloud technologies

---

## 🔧 Technologies & Tools
Here are some of the tools and technologies I work with:
- **Cloud Providers**: AWS, Azure, Google Cloud Platform
- **Infrastructure as Code**: Terraform, CloudFormation, Pulumi
- **CI/CD Tools**: GitHub Actions, Jenkins, GitLab CI
- **Containers & Orchestration**: Docker, Kubernetes
- **Programming Languages**: Python, Go, JavaScript
- **Monitoring & Observability**: Prometheus, Grafana, ELK Stack

---

## 📈 GitHub Stats
![DedicatedCloud's GitHub Stats](https://github-readme-stats.vercel.app/api?username=dedicatedcloud&show_icons=true&hide_title=true&count_private=true&hide=issues&theme=radical)

---

## 🛠️ My Projects
Here are a few highlights from my repositories:
- [**Cloud Automator**](https://github.com/dedicatedcloud/cloud-automator): Automate your cloud infrastructure with ease
- [**Kubernetes Toolkit**](https://github.com/dedicatedcloud/kubernetes-toolkit): Tools and scripts for managing K8s clusters
- [**DevOps Playbook**](https://github.com/dedicatedcloud/devops-playbook): A collection of best practices, tools, and resources for DevOps enthusiasts

---

## 🤝 Let's Collaborate!
I'm always looking for opportunities to collaborate on interesting projects. Feel free to reach out if you:
- Need help with a cloud or DevOps-related project
- Want to contribute to any of my repositories
- Have an innovative idea you'd like to discuss

---

## 📫 How to Reach Me
- 📧 Email: dedicatedcloud@example.com
- 🐦 Twitter: [@DedicatedCloud](https://twitter.com/dedicatedcloud)
- 💼 LinkedIn: [DedicatedCloud](https://linkedin.com/in/dedicatedcloud)

Let's build something amazing together! 🚀
-->
<!--
# Project Title

A brief description of what this project does and who it's for


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Appendix

Any additional information goes here


## Authors

- [@octokatherine](https://www.github.com/octokatherine)


## Used By

This project is used by the following companies:

- Company 1
- Company 2


## Usage/Examples

```javascript
import Component from 'my-project'

function App() {
  return <Component />
}
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## Support

For support, email fake@fake.com or join our Slack channel.


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Roadmap

- Additional browser support

- Add more integrations


## Related

Here are some related projects

[Awesome README](https://github.com/matiassingers/awesome-readme)


## Optimizations

What optimizations did you make in your code? E.g. refactors, performance improvements, accessibility


![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## 🛠 Skills
Javascript, HTML, CSS...


## Other Common Github Profile Sections
👩‍💻 I'm currently working on...

🧠 I'm currently learning...

👯‍♀️ I'm looking to collaborate on...

🤔 I'm looking for help with...

💬 Ask me about...

📫 How to reach me...

😄 Pronouns...

⚡️ Fun fact...


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


# Hi, I'm Katherine! 👋


## 🚀 About Me
I'm a full stack developer...


## Feedback

If you have any feedback, please reach out to us at fake@fake.com


## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## Documentation

[Documentation](https://linktodocumentation)


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Demo

Insert gif or link to demo


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |
| Example Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |
| Example Color | ![#00b48a](https://via.placeholder.com/10/00b48a?text=+) #00b48a |
| Example Color | ![#00d1a0](https://via.placeholder.com/10/00b48a?text=+) #00d1a0 |


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


##  My Section
-->




