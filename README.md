# CodeAlpha_QuoteGenerator
# Random Quote Generator

A clean, responsive quote generator built with **HTML, CSS and JavaScript**.
Created for the **CodeAlpha App Development Internship, Task 2**.

## Live Demo
**https://eman-ahm.github.io/CodeAlpha_QuoteGenerator/**

## Features
- Shows a random quote and its author when the page opens and on every **New Quote** click
- Never shows the same quote twice in a row
- 37 quotes in three categories (Success, Discipline, Coding) with filter buttons
- **Copy** a quote to the clipboard
- **Share** a quote, using the device share sheet on phones or an X (Twitter) post on desktop
- **Favorite** quotes, saved in the browser with a saved-quotes panel and a count badge
- Animated gradient background that changes with each quote
- Toast notifications for user feedback
- Fully responsive for phones, tablets and desktops
- Keyboard accessible, with labeled icon buttons and reduced-motion support

## Tech Stack
| Technology | Use |
|---|---|
| HTML5 | Page structure and inline SVG icons |
| CSS3 | Layout, gradient animation, glass card and responsive design |
| JavaScript | Random selection, filtering, favorites (localStorage), copy and share |
| Google Fonts | Playfair Display for the quote text |

## Project Structure

CodeAlpha_QuoteGenerator/
├── index.html   # Page structure
├── style.css    # Design and responsive layout
├── quotes.js    # Quote data (text, author, category)
├── script.js    # App logic
└── README.md


## Run Locally
1. Download or clone this repository
2. Open index.html in any modern browser

No installation or build step is needed.

## Add Your Own Quotes
Open quotes.js and add a line to the list:js
{ category: "Success", text: "Your quote here.", author: "Author Name" },


## Author
Built by [Eman-Ahm](https://github.com/Eman-Ahm) as part of the CodeAlpha internship.
