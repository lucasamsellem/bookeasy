# BookEasy 📅

> Plateforme de réservation en ligne pour les prestataires indépendants

BookEasy est une application web de gestion et de réservation de créneaux conçue pour les professionnels indépendants (coachs, photographes, consultants, formateurs, etc.). Elle centralise la gestion des prestations, des disponibilités et des rendez-vous sur une plateforme unique afin d'automatiser l'organisation quotidienne.

---

## Table des matières

- [Objectifs](#-objectifs)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Design & Accessibilité](#-design--accessibilité)
- [Sécurité & RGPD](#-sécurité--rgpd)
- [Éco-conception](#-éco-conception)
- [Installation](#-installation)
- [Contribuer](#-contribuer)

---

## 🚀 Objectifs

BookEasy résout les problèmes liés à la gestion manuelle des rendez-vous : perte de temps, erreurs de planification, doublons. La plateforme propose :

- **L'automatisation** du processus de réservation.
- **La visibilité en temps réel** des créneaux disponibles pour les clients.
- **La centralisation** de toutes les informations (services, planning, réservations).

---

## ✨ Fonctionnalités

### Pour les Prestataires 🛠️

| Fonctionnalité          | Description                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| Gestion du profil       | Création et modification d'un compte professionnel et d'un profil public       |
| Gestion des prestations | Création, modification et suppression des services (titre, durée, description) |
| Gestion du planning     | Définition des créneaux, modification et blocage de plages horaires            |
| Suivi des réservations  | Consultation des détails des rendez-vous et gestion des annulations            |

### Pour les Clients 👤

| Fonctionnalité           | Description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Consultation & Recherche | Accès aux détails des prestations et visualisation des disponibilités en temps réel |
| Réservation en ligne     | Prise de rendez-vous simplifiée avec confirmation immédiate                         |
| Espace personnel         | Historique des réservations (passées et à venir) et gestion des annulations         |
| Avis                     | Possibilité de laisser une note ou un commentaire après une prestation              |

### Pour l'Administrateur 🔑

- Supervision des utilisateurs
- Gestion globale des réservations
- Modération des avis

---

## 🛠️ Stack technique

L'application adopte une architecture modulaire orientée fonctionnalités (**feature-based**) pour garantir maintenance et évolutivité.

### Front-end

| Technologie                                     | Rôle                                                        |
| ----------------------------------------------- | ----------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                  | Framework principal, routing, optimisation des performances |
| [Tailwind CSS](https://tailwindcss.com/) & SCSS | Interface moderne, responsive et styles maintenables        |
| [Zustand](https://zustand-demo.pmnd.rs/)        | Gestion de l'état global légère et performante              |
| [React Query](https://tanstack.com/query)       | Cache et gestion des requêtes asynchrones avec l'API        |

### Back-end

| Technologie                                                        | Rôle                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | Environnement d'exécution et framework serveur             |
| [MySQL](https://www.mysql.com/)                                    | Base de données relationnelle pour les données structurées |
| [JWT](https://jwt.io/)                                             | Authentification sécurisée et stateless                    |
| [Bcrypt](https://www.npmjs.com/package/bcrypt)                     | Hashage sécurisé des mots de passe                         |

---

## 🎨 Design & Accessibilité

- **Responsive Design** — L'interface s'adapte aux mobiles, tablettes et ordinateurs.
- **Accessibilité (RGAA / WCAG)** — Respect des standards pour l'inclusion des personnes en situation de handicap.
- **Mode Sombre** — Intégration d'un thème clair/sombre pour le confort visuel.

---

## 🔐 Sécurité & RGPD

- **Protection des données** — Collecte minimale des données et conformité RGPD (droit de modification et suppression).
- **Sécurisation applicative** — Protection contre les failles CSRF, XSS et injections SQL.

---

## 🌿 Éco-conception

BookEasy intègre des principes de sobriété numérique :

- Optimisation du poids des pages et des images.
- Mise en place du **lazy loading** pour les médias.
- Nettoyage régulier du code pour limiter la complexité inutile.

---

<!-- ## 📦 Installation

> Prérequis : Node.js ≥ 18, MySQL ≥ 8

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/bookeasy.git
cd bookeasy

# Installer les dépendances front-end
cd client
npm install

# Installer les dépendances back-end
cd ../server
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner les variables (base de données, JWT secret, etc.)

# Démarrer en développement
npm run dev
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour proposer une amélioration :

1. Forkez le dépôt
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committez vos changements : `git commit -m 'feat: ajout de ma fonctionnalité'`
4. Poussez la branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE). -->
