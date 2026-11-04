# Setup guide

## 1. Appwrite Console (cloud.appwrite.io)
1. Create a project. Copy the **Project ID** (Settings) and note your **region** (fra, nyc, sgp...).
2. **Overview -> Add platform -> Web**. Add hostname `localhost`. After deploying, add your Vercel domain too (e.g. `afziya-fashion.vercel.app`).
3. **Auth -> Settings**: keep Email/Password on. Set minimum password length to 8.
4. **Auth -> Teams**: create two teams with these exact IDs: `owner` and `admins`.
5. Register your owner account (use /auth on the site), then in Console add that user to the `owner` team. The owner should be the only member until you deliberately add staff.
6. **Overview -> API keys -> Create**: scopes `databases.read`, `databases.write`, `collections.read`, `collections.write`, `attributes.read`, `attributes.write`, `indexes.read`, `indexes.write`. Copy the key once.

## 2. Create the database
```
cd backend
cp .env.example .env      # fill in region, project ID, API key
npm install
npm run setup             # needs Node 20.6+
```
The script is safe to re-run. Check Console -> Databases -> AFZIYA FASHION shows 25 collections.
Delete the API key from your machine's `.env` afterwards if you no longer need it.

## 3. Run the website
```
cd frontend
# edit .env: VITE_APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
#            VITE_APPWRITE_PROJECT_ID=<PROJECT_ID>
npm install
npm run dev
```
Open http://localhost:5173/auth, sign up, see "Welcome, <name>", sign out, sign in again.
Errors like "Invalid origin" mean the hostname in step 1.2 is missing.

## 4. GitHub
```
cd afziya-fashion
git init
git add .
git commit -m "Phase 1-2: brand, auth, database setup"
git branch -M main
git remote add origin https://github.com/<you>/afziya-fashion.git
git push -u origin main
```
`.env` files are git-ignored. Check `git status` shows no `.env` before pushing.

## 5. Vercel
1. vercel.com -> Add New Project -> import the GitHub repo.
2. **Root Directory: `frontend`**. Framework: Vite (auto-detected).
3. Environment variables: `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID`.
4. Deploy, then add the Vercel domain as a Web platform in Appwrite (step 1.2).

## 6. Android
The Android app is Phase 11 (React Native + Expo, reusing the same Appwrite backend). Until then the
deployed website works on Android phones in Chrome (menu -> Add to Home screen).
