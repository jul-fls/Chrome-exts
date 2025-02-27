# Extension Chrome - Recherche de Conteneurs Portainer

## 📌 Description
Cette extension Chrome permet de rechercher dynamiquement des conteneurs dans une instance **Portainer** en fonction d'un texte saisi par l'utilisateur. Elle utilise l'API de Portainer pour récupérer les environnements et conteneurs, et affiche les résultats sous forme de tableau interactif.

### ✨ Fonctionnalités principales
- **Recherche dynamique** : Filtrage instantané des conteneurs au fur et à mesure de la frappe.
- **Affichage structuré** : Présente les conteneurs sous forme de tableau avec trois colonnes :
  - **Nom du conteneur** → Lien vers la page de détails du conteneur.
  - **Status du conteneur**
  - **Nom de l'environnement** → Lien vers le tableau de bord de l'environnement.
  - **Nom de la stack** (si applicable) → Lien vers la page de gestion de la stack.
  - **Actions** → Actions sur le container et la stack
- **Configuration simple** : Définissez l'URL de votre instance Portainer et votre access token depuis la page des options.
- **Icône d'extension** : Un clic sur l'icône de l'extension ouvre la popup pour effectuer une recherche rapide.

---

## 🔧 Installation
Cette extension n'est pas disponible sur le Chrome Web Store, elle doit être installée manuellement.

### 📥 1. Télécharger l'extension
1. Accédez au **dépôt GitLab** contenant le projet.
2. Cliquez sur **"Code"** en haut à droite et sélectionnez **"Download source code au format ZIP"**.
3. Une fois le téléchargement terminé, **décompressez** le fichier ZIP dans un dossier de votre choix.

### 🖥️ 2. Installer l'extension dans votre navigateur
1. Ouvrez **Google Chrome**, **Microsoft Edge**, **Brave**, ou tout autre navigateur basé sur Chromium.
2. Accédez à la page des extensions en tapant dans la barre d'adresse :
   ```
   chrome://extensions/
   ```
3. Activez le **Mode développeur** en haut à droite.
4. Cliquez sur **Charger une extension non empaquetée**.
5. Sélectionnez le dossier **décompressé** contenant l'extension.
6. L'extension est maintenant installée et accessible via son icône dans la barre d'extensions.

---

## ⚙️ Configuration de l'extension
Avant d'utiliser l'extension, vous devez configurer l'accès à votre instance **Portainer**.

### 🔑 1. Accéder à la page des options
1. Faites un **clic droit** sur l'icône de l'extension.
2. Cliquez sur **"Options"**.

### 🌐 2. Configurer l'URL de Portainer
- Saisissez l'URL de votre instance Portainer (ex: `https://portainer.mondomaine.com`).
- Dès que l'URL est renseignée, un **lien automatique** vers la page de création de token apparaîtra.

### 🔐 3. Générer un Access Token
1. Cliquez sur le **lien généré** sous l’URL Portainer.
2. Dans l'interface Portainer, créez un **Access Token**.
3. Copiez-collez ce **token** dans le champ correspondant de l'extension.
4. Cliquez sur **"Enregistrer"**.

L'extension est maintenant prête à être utilisée ! 🚀

---

## 🔍 Utilisation
1. Cliquez sur l'**icône de l'extension**.
2. Saisissez un texte pour rechercher un conteneur.
3. Les résultats s'affichent dynamiquement sous forme de tableau.
4. Cliquez sur un élément pour accéder directement à **Portainer** :
   - 📦 **Nom du conteneur** → Page des détails du conteneur.
   - 🌍 **Nom de l'environnement** → Tableau de bord de l'environnement.
   - 🛠 **Nom de la stack** → Gestion de la stack (si applicable).

---

## ❓ Support & Problèmes
Si vous rencontrez des problèmes avec l'extension, vous pouvez :
- Vérifier que l'**URL et l'Access Token** sont corrects.
- Vérifier que votre instance **Portainer autorise les requêtes API**.
- Ouvrir la **console développeur** (`F12` > Console) pour voir d'éventuelles erreurs.
- Contacter le développeur via **GitLab**.

Bonne utilisation ! 🚀

