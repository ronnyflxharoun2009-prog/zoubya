# 🇩🇿 Baccalauréat Algérie — 3ème Mathélème (2008–2026)

Application web statique épurée et sans distraction pour la révision des épreuves officielles du Baccalauréat Algérien (Série Mathématiques).

## 🚀 Fonctionnalités
- **Navigation zen centrée :** 3 unités actives prêtes à l'emploi (*Fonctions Exponentielles*, *Fonctions Logarithmiques*, *Suites Numériques*).
- **Sous-unités intégrées :** Limites, Dérivabilité & Continuité, Croissance Comparée & Étude de Fonctions.
- **Séparation nette par Sujet :** Distinction claire entre *Sujet 1* (`M{YEAR}-1`) et *Sujet 2* (`M{YEAR}-2`) par année (2008 à 2026).
- **Visionneuse PDF haute précision :** Accès direct en un clic au texte du sujet et au corrigé officiel.
- **Bilingue & Thèmes :** Support complet Arabe (RTL) / Français (LTR), mode sombre et curseur inversé `mix-blend-mode: difference`.

---

## 🌐 Déploiement sur GitHub Pages (En 2 minutes)

Ce projet est configuré pour se déployer **automatiquement** et **gratuitement** sur GitHub Pages via GitHub Actions.

### Étape 1 : Initialiser et pousser sur GitHub
Ouvrez votre terminal dans ce dossier et exécutez :

```bash
git init
git add .
git commit -m "Initial commit - Bac Math Archive"
git branch -M main
git remote add origin https://github.com/VOTRE_PSEUDO/NOM_DU_REPO.git
git push -u origin main
```

*(Remplacez `VOTRE_PSEUDO/NOM_DU_REPO` par votre lien de dépôt GitHub).*

### Étape 2 : Activer GitHub Pages
1. Sur votre dépôt GitHub, allez dans **Settings** (Paramètres).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Dans la section **Build and deployment > Source**, sélectionnez :  
   👉 **GitHub Actions**
4. C'est tout ! L'onglet **Actions** de votre dépôt va compiler et publier automatiquement le site en ~1 minute.
5. Votre site sera accessible sur :  
   `https://VOTRE_PSEUDO.github.io/NOM_DU_REPO/`

---

## 💻 Développement local

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Tester le build statique de production
npm run build
npm run preview
```
