# YouTube Toxicity Analyzer

A full-stack web application that analyzes YouTube comment toxicity using Machine Learning.  
Built with **Django REST Framework** (backend), **Next.js 16** (frontend), and **scikit-learn** (ML model).

---

##  Features

-  Analyze toxicity of YouTube comments (real-time)
-  ML-based toxicity detection (trained using scikit-learn)
-  REST API with Django backend
-  Modern Next.js frontend (React + Tailwind)
-  Cross-Origin Resource Sharing (CORS) configured

---

##  Screenshot

<img width="1899" height="905" alt="image" src="https://github.com/user-attachments/assets/487b040c-e2b2-437d-ad5e-74b92677b7aa" />


##  Tech Stack

**Backend:**
- Django 5.2.7
- Django REST Framework
- psycopg2-binary (PostgreSQL)
- scikit-learn, pandas, numpy
- Gunicorn (for production)
- Railway (deployment)

**Frontend:**
- Next.js 16
- Tailwind CSS
- Axios (API calls)
- TypeScript

---

##  Setup Instructions

###  Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
###  Frontend (Next.js)

```bash
cd frontend
npm install
npm run de
```

##  Environment Variables

###  Backend (Django)

```bash
SECRET_KEY=your_secret_key
DEBUG=False
YOUTUBE_API_KEY=your_youtube_key
ALLOWED_HOSTS=*
```

###  Frontend (Next.js)

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
```

##  License
This project is open-source and available under the MIT License

##  Author
**Sameer Shah** — AI & Full-Stack Developer  
[Portfolio](https://sameershah-portfolio.vercel.app/) 
