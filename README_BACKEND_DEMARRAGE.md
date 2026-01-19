# Démarrage du Backend - Guide de Résolution

## Résumé des Actions Effectuées

### ✅ Commandes Exécutées avec Succès

```bash
# 1. Navigation vers le dossier backend
cd backendN

# 2. Compilation du projet
mvn clean compile

# 3. Démarrage de l'application Spring Boot
mvn org.springframework.boot:spring-boot-maven-plugin:run
```

## 🔧 Problèmes Rencontrés et Solutions

### Problème 1: Maven Wrapper Non Reconnu

```
❌ .\mvnw.cmd spring-boot:run
```

**Erreur:** `.\mvnw.cmd is not recognized`

**Solution:** Utiliser Maven directement au lieu du wrapper

### Problème 2: Plugin Spring Boot Introuvable

```
❌ mvn spring-boot:run
```

**Erreur:** `No plugin found for prefix 'spring-boot'`

**Solution:** Utiliser la commande complète du plugin Maven

### Problème 3: Mauvais Répertoire de Travail

```
❌ mvn commande (depuis le dossier racine)
```

**Erreur:** `No POM in this directory`

**Solution:** S'assurer d'être dans le dossier `backendN`

## 🚀 Résultat Final

✅ **Application démarrée avec succès**

- **Port:** 8763
- **URL:** http://localhost:8763
- **Base de données:** PostgreSQL (version 17.6)
- **Framework:** Spring Boot 3.5.3

## 📝 Notes Importantes

- L'application utilise le port **8763** au lieu du port standard 8080
- La base de données PostgreSQL est connectée et fonctionnelle
- 5 repositories JPA ont été détectés et initialisés
- Quelques avertissements Spring Data JDBC peuvent être ignorés (n'affectent pas le fonctionnement)

## ⚡ Commande Rapide pour Redémarrer

```bash
cd backendN && mvn org.springframework.boot:spring-boot-maven-plugin:run
```
