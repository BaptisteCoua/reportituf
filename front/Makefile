.PHONY: help dev up down restart logs shell install add lint format test clean-cache node-version deep-clean

PORT=3456

CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
MAGENTA := \033[35m
BOLD := \033[1m
RESET := \033[0m

help:
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║                                                            ║$(RESET)"
	@echo "$(CYAN)║          $(BOLD)🎨 Frontend Nuxt 4 - Dev Mode 🎨$(RESET)$(CYAN)                 ║$(RESET)"
	@echo "$(CYAN)║                                                            ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)⚡ DÉMARRAGE$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)           🎬 Lance le front seul"
	@echo "  $(GREEN)make up$(RESET)            🚀 Lance en arrière-plan"
	@echo "  $(RED)make down$(RESET)          🛑 Arrête"
	@echo "  $(YELLOW)make restart$(RESET)       ♻️  Redémarre"
	@echo ""
	@echo "$(BOLD)🧹 CACHE$(RESET)"
	@echo "  $(MAGENTA)make clean-cache$(RESET)   💨 Vide cache (nuxi cleanup)"
	@echo "  $(RED)make deep-clean$(RESET)    🔥 Nettoyage profond + reinstall"
	@echo ""
	@echo "$(BOLD)🛠️  DÉVELOPPEMENT$(RESET)"
	@echo "  $(GREEN)make shell$(RESET)         💻 Shell dans le conteneur"
	@echo "  $(GREEN)make install$(RESET)       📦 Install dépendances"
	@echo "  $(GREEN)make add PKG=x$(RESET)     ➕ Ajoute un package"
	@echo "  $(CYAN)make lint$(RESET)          🔍 Biome lint"
	@echo "  $(CYAN)make format$(RESET)        ✨ Biome format"
	@echo "  $(YELLOW)make test$(RESET)          🧪 Lance les tests"
	@echo ""
	@echo "$(BOLD)📊 INFOS$(RESET)"
	@echo "  $(CYAN)make logs$(RESET)          📜 Affiche les logs"
	@echo "  $(CYAN)make node-version$(RESET)  📦 Versions Node/pnpm/Nuxt"
	@echo ""
	@echo "$(YELLOW)⚠️  Pour lancer TOUTE la stack: utilisez le Makefile à la racine$(RESET)"
	@echo ""

dev:
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║   🎨 Démarrage Frontend...             ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)⚠️  Lance uniquement le front (sans back)$(RESET)"
	@echo "$(GREEN)🚀 Frontend sur http://localhost:$(PORT)$(RESET)"
	@echo ""
	@docker compose up

up:
	@echo "$(GREEN)🚀 Frontend sur http://localhost:$(PORT)$(RESET)"
	@docker compose up -d

down:
	@echo "$(RED)🛑 Arrêt du frontend...$(RESET)"
	@docker compose down

restart:
	@echo "$(YELLOW)♻️  Redémarrage du frontend...$(RESET)"
	@docker compose restart
	@echo "$(GREEN)✓$(RESET) Frontend redémarré"

logs:
	@docker compose logs -f

shell:
	@echo "$(GREEN)💻 Ouverture du shell...$(RESET)"
	@docker compose exec front sh

install:
	@echo "$(GREEN)📦 Installation des dépendances...$(RESET)"
	@docker compose exec front pnpm install
	@echo "$(GREEN)✓$(RESET) Installation terminée"

add:
	@echo "$(GREEN)➕ Ajout du package $(PKG)...$(RESET)"
	@docker compose exec front pnpm add $(PKG)
	@echo "$(GREEN)✓$(RESET) Package ajouté"

lint:
	@echo "$(CYAN)🔍 Linting en cours...$(RESET)"
	@docker compose exec front pnpm biome check .

format:
	@echo "$(CYAN)✨ Formatage du code...$(RESET)"
	@docker compose exec front pnpm biome check --write .
	@echo "$(GREEN)✓$(RESET) Code formaté"

test:
	@echo "$(YELLOW)🧪 Exécution des tests...$(RESET)"
	@docker compose exec front pnpm test

clean-cache:
	@echo ""
	@echo "$(MAGENTA)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(MAGENTA)║   💨 Nettoyage du cache Nuxt...        ║$(RESET)"
	@echo "$(MAGENTA)╚════════════════════════════════════════╝$(RESET)"
	@echo "$(CYAN)🧹 Nuxi cleanup...$(RESET)"
	@docker compose exec front pnpm nuxi cleanup
	@echo "$(CYAN)🗑️  Suppression .output et dist...$(RESET)"
	@docker compose exec front rm -rf .output dist
	@echo "$(GREEN)✓$(RESET) Cache vidé - Redémarrage..."
	@$(MAKE) restart
	@echo ""

deep-clean:
	@echo ""
	@echo "$(RED)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(RED)║   🔥 Nettoyage profond...              ║$(RESET)"
	@echo "$(RED)╚════════════════════════════════════════╝$(RESET)"
	@docker compose down -v
	@echo "$(RED)🗑️  Suppression node_modules...$(RESET)"
	@rm -rf node_modules .nuxt .output dist
	@echo "$(CYAN)🐳 Rebuild du conteneur...$(RESET)"
	@docker compose build --no-cache
	@echo "$(GREEN)📦 Installation...$(RESET)"
	@docker compose up -d
	@docker compose exec front pnpm install
	@echo ""
	@echo "$(GREEN)✓$(RESET) Nettoyage profond terminé"
	@echo ""

node-version:
	@echo "$(CYAN)📦 Versions:$(RESET)"
	@docker compose exec front node --version
	@docker compose exec front pnpm --version
	@docker compose exec front pnpm list nuxt --depth=0 2>/dev/null | grep nuxt || echo "Nuxt: (à installer)"
```

---

## 📍 Résumé des emplacements
```
reportituf/
├── Makefile                    ← Makefile RACINE (gère toute la stack)
├── docker-compose.global.yml
├── .env
│
├── front/
│   ├── Makefile                ← Makefile FRONT (gère le front seul)
│   ├── docker-compose.yml
│   ├── nuxt.config.ts
│   └── ...
│
└── back/
    └── ...