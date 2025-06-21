# Souhardya Kundu - Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and TailwindCSS. Features a clean design, project showcase, and admin dashboard for content management.

## 🚀 Features

- **Responsive Design** - Works perfectly on all devices
- **Project Showcase** - Dynamic project display with GitHub integration
- **Admin Dashboard** - Secure admin panel for project management
- **Modern UI** - Clean, professional design with smooth animations
- **GitHub Integration** - Automatic project syncing from GitHub repositories
- **Contact Form** - Built-in contact functionality
- **SEO Optimized** - Proper meta tags and structure

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with custom design system
- **Database**: Prisma ORM with MySQL
- **Authentication**: Custom JWT-based auth system
- **Icons**: Lucide React
- **Deployment**: Platform agnostic (works on any Node.js host)

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/souhardya-portfolio.git
cd souhardya-portfolio
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local`:
\`\`\`env
DATABASE_URL="your-database-url"
GITHUB_TOKEN="your-github-token"
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="your-jwt-secret"
\`\`\`

5. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🔧 Configuration

### GitHub Integration
1. Create a GitHub Personal Access Token
2. Add it to your `.env.local` as `GITHUB_TOKEN`
3. The system will automatically sync your public repositories

### Admin Dashboard
1. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your environment
2. Access the admin panel at `/admin/login`
3. Manage your projects, toggle visibility, and sync with GitHub

### Database Setup
The project uses Prisma with MySQL. You can also use PostgreSQL by updating the schema.

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── navigation.tsx     # Navigation component
│   └── sections/          # Page sections
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── database.ts       # Database operations
│   └── github.ts         # GitHub API integration
├── prisma/               # Database schema
└── middleware.ts         # Route protection
\`\`\`

## 🚀 Deployment

This project can be deployed on any platform that supports Node.js:

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Configure environment variables

### Option 3: Railway/DigitalOcean/AWS
1. Set up your server with Node.js
2. Clone your repository
3. Install dependencies and build
4. Set up environment variables
5. Start with `npm start`

## 🔒 Security

- JWT-based authentication for admin access
- Environment variables for sensitive data
- Middleware protection for admin routes
- Input validation and sanitization

## 📝 Customization

### Updating Personal Information
1. Edit `components/sections/hero.tsx` for intro text
2. Update `components/sections/about.tsx` for about section
3. Modify `components/sections/contact.tsx` for contact details

### Styling
- Main styles in `app/globals.css`
- Component-specific styles use TailwindCSS classes
- Custom utilities defined in globals.css

### Adding New Sections
1. Create component in `components/sections/`
2. Import and add to `app/page.tsx`
3. Update navigation in `components/navigation.tsx`



## 📞 Contact

- **Email**: kundusouhardya@gmail.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub]([https://github.com/yourusername](https://github.com/Souhar-dya))

---

Built by Souhardya Kundu
\`\`\`

```plaintext file=".env.example"
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"

# GitHub Integration
GITHUB_TOKEN="github_pat_your_token_here"

# Admin Authentication
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-123"
JWT_SECRET="your-super-secret-jwt-key-here"

# Optional: For production deployment
NODE_ENV="production"
