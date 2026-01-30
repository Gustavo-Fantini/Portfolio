# 🌐 PERSONAL PORTFOLIO WEBSITE - GUSTAVO FANTINI

Professional portfolio website built with pure HTML, CSS, and JavaScript. Clean, modern, and fully responsive design optimized for recruiters and hiring managers.

## 🚀 Quick Start

### Option 1: Open Locally
1. Double-click `index.html` to open in your browser
2. That's it! No build process required.

### Option 2: Use Live Server (Recommended)
```bash
# If you have Python installed:
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Interactive features
└── README.md           # This file
```

## ✏️ Customization Guide

### 1. Update Personal Information

**In `index.html`, find and replace:**

```html
<!-- Line ~51: Hero Section -->
<h1 class="hero-title">Hi, I'm <span class="highlight">Gustavo Fantini</span></h1>

<!-- Line ~68: Social Links -->
<a href="https://github.com/YOUR_GITHUB" target="_blank">
<a href="https://linkedin.com/in/gustavo-fantini" target="_blank">
<a href="mailto:gustavo.teodoro.fantini@gmail.com">

<!-- Line ~87+: About Section - Rewrite to match your story -->

<!-- Line ~140+: Experience Section - Add your experiences -->

<!-- Line ~200+: Projects Section - Add your projects with:
  - Project name
  - Description
  - Technologies
  - GitHub link
  - Live demo link (if available)
-->
```

### 2. Update Colors (Optional)

**In `styles.css`, change CSS variables:**

```css
:root {
    --primary-color: #2563eb;        /* Main brand color */
    --primary-dark: #1e40af;         /* Darker shade */
    --secondary-color: #64748b;      /* Secondary color */
    /* ... other colors */
}
```

**Popular Color Schemes:**
- Blue (Default): `#2563eb`
- Purple: `#9333ea`
- Green: `#10b981`
- Orange: `#f97316`
- Red: `#ef4444`

### 3. Add Profile Photo (Optional)

Add an `<img>` tag in the About or Hero section:

```html
<div class="profile-photo">
    <img src="path/to/your/photo.jpg" alt="Gustavo Fantini">
</div>
```

Then add CSS:
```css
.profile-photo img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--shadow-lg);
}
```

### 4. Add More Projects

Copy this template in the projects section:

```html
<div class="project-card">
    <div class="project-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Project Name</h3>
    <p>Project description here...</p>
    <div class="project-tech">
        <span>Tech 1</span>
        <span>Tech 2</span>
        <span>Tech 3</span>
    </div>
    <div class="project-links">
        <a href="GITHUB_LINK" target="_blank" class="btn btn-small">
            <i class="fab fa-github"></i> Code
        </a>
        <a href="DEMO_LINK" target="_blank" class="btn btn-small btn-outline">
            <i class="fas fa-external-link-alt"></i> Demo
        </a>
    </div>
</div>
```

**FontAwesome Icons:** Browse at https://fontawesome.com/icons

## 🌐 Deployment Options

### Option 1: GitHub Pages (FREE & RECOMMENDED)

1. **Create GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to "Pages"
   - Source: Select "main" branch
   - Save

3. **Your site will be live at:**
   ```
   https://YOUR_USERNAME.github.io
   ```

**Custom Domain (Optional):**
- Buy domain (~$10/year) from Namecheap, Google Domains, etc.
- Add CNAME file to repository with your domain
- Configure DNS in domain provider

### Option 2: Netlify (FREE)

1. **Via Netlify UI:**
   - Go to https://netlify.com
   - Drag and drop your `portfolio` folder
   - Done! Your site is live

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

**Pros:**
- Auto-deploy from GitHub
- Custom domains easy
- Fast CDN
- HTTPS automatic

### Option 3: Vercel (FREE)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd portfolio
   vercel --prod
   ```

**Pros:**
- Lightning fast
- Great for developers
- Easy custom domains
- Excellent analytics

### Option 4: Traditional Web Host

Upload files via FTP to any web hosting service:
- Hostinger
- Bluehost  
- SiteGround
- GoDaddy

## 🎨 Customization Ideas

### Add Blog Section
Create `blog.html` and link from navigation:
```html
<li><a href="blog.html">Blog</a></li>
```

### Add Testimonials
```html
<section class="testimonials">
    <div class="container">
        <h2 class="section-title">Testimonials</h2>
        <div class="testimonial-card">
            <p>"Quote here..."</p>
            <h4>— Name, Title @ Company</h4>
        </div>
    </div>
</section>
```

### Add Resume Download
```html
<a href="Gustavo_Fantini_Resume.pdf" download class="btn btn-primary">
    <i class="fas fa-download"></i> Download Resume
</a>
```

### Add Google Analytics
Add before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Maintenance

### Regular Updates:
- [ ] Add new projects as you complete them
- [ ] Update experience section
- [ ] Keep skills current
- [ ] Add certifications
- [ ] Refresh testimonials
- [ ] Update resume PDF

### SEO Optimization:
- [ ] Add meta descriptions
- [ ] Use semantic HTML
- [ ] Add alt text to images
- [ ] Create sitemap.xml
- [ ] Submit to Google Search Console

## 📱 Testing Checklist

Before going live, test:

**Desktop:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Mobile:**
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Responsive design (use DevTools)

**Performance:**
- [ ] Run Google Lighthouse
- [ ] Optimize images
- [ ] Minimize CSS/JS (for production)

**Links:**
- [ ] All external links open in new tab
- [ ] All links work correctly
- [ ] Email links work
- [ ] Social media links correct

## 🚨 Common Issues

### Issue: Icons not showing
**Solution:** Check internet connection. FontAwesome loads from CDN.

### Issue: Animations not working
**Solution:** Make sure `script.js` is linked correctly at bottom of `index.html`.

### Issue: Mobile menu not working
**Solution:** Check JavaScript console for errors.

### Issue: Slow loading
**Solution:** 
- Optimize images (use TinyPNG.com)
- Use WebP format for images
- Enable caching

## 💡 Pro Tips

1. **Keep it Simple:** Don't overcomplicate. Clean design wins.

2. **Mobile First:** Most recruiters check on phone first.

3. **Fast Loading:** Aim for <3 seconds load time.

4. **Call to Action:** Make it obvious how to contact you.

5. **Proofread:** No typos! Get someone else to review.

6. **Analytics:** Track visitors to see what works.

7. **A/B Test:** Try different headlines, layouts.

8. **Regular Updates:** Update quarterly at minimum.

9. **Backup:** Keep a copy of your site files!

10. **Link Everywhere:** Add portfolio link to:
    - LinkedIn
    - Resume
    - Email signature
    - GitHub profile
    - Cover letters

## 📊 Portfolio SEO Checklist

```html
<!-- Add to <head> -->
<meta name="description" content="Gustavo Fantini - Software Engineering Student specializing in Backend Development and Machine Learning. View my projects and experience.">
<meta name="keywords" content="software engineer, backend developer, python developer, machine learning, portfolio">
<meta name="author" content="Gustavo Fantini">

<!-- Open Graph (for social sharing) -->
<meta property="og:title" content="Gustavo Fantini | Software Engineer">
<meta property="og:description" content="Backend Developer & ML Enthusiast">
<meta property="og:image" content="URL_TO_PREVIEW_IMAGE">
<meta property="og:url" content="YOUR_WEBSITE_URL">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Gustavo Fantini | Software Engineer">
<meta name="twitter:description" content="Backend Developer & ML Enthusiast">
<meta name="twitter:image" content="URL_TO_PREVIEW_IMAGE">
```

## 🎯 Next Steps After Deployment

1. **Share Your Portfolio:**
   - [ ] Add to LinkedIn
   - [ ] Add to resume
   - [ ] Add to email signature
   - [ ] Share on Twitter/LinkedIn post
   - [ ] Add to GitHub profile README

2. **Monitor Performance:**
   - [ ] Set up Google Analytics
   - [ ] Check Google Search Console
   - [ ] Monitor load times
   - [ ] Track visitor sources

3. **Continuous Improvement:**
   - [ ] Get feedback from 3-5 people
   - [ ] A/B test different headlines
   - [ ] Add new projects monthly
   - [ ] Update content quarterly

## 📞 Support

If you need help customizing or deploying:
- **Email:** gustavo.teodoro.fantini@gmail.com
- **LinkedIn:** linkedin.com/in/gustavo-fantini

## 📝 License

Feel free to use this template for your own portfolio. Just customize it to make it yours!

---

**Good luck with your job search! 🚀**

*Remember: Your portfolio is never "done" — it's a living document that grows with your career.*
