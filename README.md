# Mini Seller Console

A modern lead and opportunity management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

You can access the live application at: **[https://mini-seller-console-orcin.vercel.app](https://mini-seller-console-orcin.vercel.app)**

## ✨ Features

- **Lead Management**: Upload, filter, sort, and manage leads from JSON files
- **Opportunity Pipeline**: Convert leads to opportunities and track sales progress
- **Advanced Filtering**: Search by name/company, filter by status, sort by multiple criteria
- **Pagination**: Customizable page sizes (10, 20, 50, 100 items per page)
- **Data Persistence**: LocalStorage integration for seamless navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Instant sorting and filtering without page reloads
- **Professional UI**: Built with shadcn/ui components and Radix UI

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks + LocalStorage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/DKunrath/mini-seller-console.git
   cd mini-seller-console
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mini-seller-console/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── leads-page.tsx    # Lead management interface
│   └── opportunities-page.tsx # Opportunity pipeline
├── hooks/                # Custom React hooks
│   ├── use-leads.ts      # Lead management logic
│   └── use-opportunities.ts # Opportunity logic
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
    └── leads.json        # Sample lead data
```

## 🎯 Usage

1. **Upload Leads**: Start by uploading a JSON file with lead data
2. **Manage Leads**: Filter, sort, and search through your leads
3. **Convert to Opportunities**: Click on leads to view details and convert them
4. **Track Pipeline**: Monitor your opportunities in the pipeline view
5. **Persistent Data**: Your data is automatically saved and restored between sessions

## 📊 Sample Data Format

The application expects JSON files with the following lead structure:

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "company": "Acme Corp",
    "email": "john@acme.com",
    "source": "website",
    "score": 85,
    "status": "new",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## 🚀 Deployment

The application is automatically deployed to Vercel. For manual deployment:

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**DKunrath** - [GitHub Profile](https://github.com/DKunrath)

---

⭐ **Star this repository if you found it helpful!**