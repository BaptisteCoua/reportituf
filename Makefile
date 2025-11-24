.PHONY: help up down logs logs-front logs-back logs-es shell-front shell-back restart restart-front restart-back clean clean-cache clean-cache-front clean-cache-back install db-fresh es-reindex versions health

CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
MAGENTA := \033[35m
BLUE := \033[34m
BOLD := \033[1m
RESET := \033[0m

help:
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║                                                            ║$(RESET)"
	@echo "$(CYAN)║        $(BOLD)🚀 REPORTITUF - Stack Complète 🚀$(RESET)$(CYAN)               ║$(RESET)"
	@echo "$(CYAN)║                                                            ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BOLD)⚡ DÉMARRAGE$(RESET)"
	@echo "  $(GREEN)make up$(RESET)              🎬 Lance TOUT (front + back + DB + ES)"
	@echo "  $(RED)make down$(RESET)            🛑 Arrête tout"
	@echo ""
	@echo "$(BOLD)🔄 REDÉMARRAGE$(RESET)"
	@echo "  $(YELLOW)make restart$(RESET)         ♻️  Redémarre TOUT"
	@echo "  $(YELLOW)make restart-front$(RESET)   🎨 Redémarre uniquement le front"
	@echo "  $(YELLOW)make restart-back$(RESET)    ⚙️  Redémarre uniquement le back"
	@echo ""
	@echo "$(BOLD)🧹 CACHE$(RESET)"
	@echo "  $(MAGENTA)make clean-cache$(RESET)       💨 Vide TOUS les caches"
	@echo "  $(MAGENTA)make clean-cache-front$(RESET) 🎨 Vide cache front (nuxi cleanup)"
	@echo "  $(MAGENTA)make clean-cache-back$(RESET)  ⚙️  Vide cache back (Laravel)"
	@echo ""
	@echo "$(BOLD)🔍 ELASTICSEARCH$(RESET)"
	@echo "  $(BLUE)make es-reindex$(RESET)        🔄 Reindex Elasticsearch"
	@echo ""
	@echo "$(BOLD)📊 LOGS & SHELL$(RESET)"
	@echo "  $(CYAN)make logs$(RESET)            📜 Logs de tous les services"
	@echo "  $(CYAN)make logs-front$(RESET)      🎨 Logs front uniquement"
	@echo "  $(CYAN)make logs-back$(RESET)       ⚙️  Logs back uniquement"
	@echo "  $(CYAN)make logs-es$(RESET)         🔍 Logs Elasticsearch"
	@echo "  $(GREEN)make shell-front$(RESET)     💻 Shell dans le front"
	@echo "  $(GREEN)make shell-back$(RESET)      💻 Shell dans le back"
	@echo ""
	@echo "$(BOLD)🛠️  UTILITAIRES$(RESET)"
	@echo "  $(GREEN)make install$(RESET)         📦 Install front + back"
	@echo "  $(YELLOW)make db-fresh$(RESET)        🗄️  Reset DB + seed + reindex"
	@echo "  $(CYAN)make versions$(RESET)        📦 Affiche les versions"
	@echo "  $(BLUE)make health$(RESET)          🏥 Check santé des services"
	@echo "  $(RED)make clean$(RESET)           🧹 Nettoie TOUT (volumes inclus)"
	@echo ""
	@echo "$(BOLD)🌐 URLS$(RESET)"
	@echo "  $(GREEN)Frontend:$(RESET)      http://localhost:3456"
	@echo "  $(BLUE)Backend:$(RESET)       http://localhost:8000"
	@echo "  $(YELLOW)Mailpit:$(RESET)       http://localhost:8025"
	@echo "  $(MAGENTA)Elasticsearch:$(RESET) http://localhost:9200"
	@echo ""

up:
	@echo ""
	@echo "$(GREEN)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(GREEN)║   🚀 Démarrage de la stack...          ║$(RESET)"
	@echo "$(GREEN)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml up -d
	@echo ""
	@echo "$(GREEN)✨ $(BOLD)Stack prête !$(RESET)"
	@echo ""
	@echo "  🎨 $(CYAN)Frontend:$(RESET)      http://localhost:3456"
	@echo "  ⚙️  $(BLUE)Backend:$(RESET)       http://localhost:8000"
	@echo "  📧 $(YELLOW)Mailpit:$(RESET)       http://localhost:8025"
	@echo "  🔍 $(MAGENTA)Elasticsearch:$(RESET) http://localhost:9200"
	@echo ""
	@echo "$(YELLOW)⏳ Patientez quelques secondes pour que tous les services démarrent...$(RESET)"
	@echo ""

down:
	@echo ""
	@echo "$(RED)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(RED)║   🛑 Arrêt de la stack...              ║$(RESET)"
	@echo "$(RED)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml down
	@echo "$(RED)✓$(RESET) Stack arrêtée"
	@echo ""

logs:
	@docker compose -f docker-compose.global.yml logs -f

logs-front:
	@echo "$(CYAN)📜 Logs Frontend...$(RESET)"
	@docker compose -f docker-compose.global.yml logs -f front

logs-back:
	@echo "$(BLUE)📜 Logs Backend...$(RESET)"
	@docker compose -f docker-compose.global.yml logs -f laravel.test

logs-es:
	@echo "$(MAGENTA)📜 Logs Elasticsearch...$(RESET)"
	@docker compose -f docker-compose.global.yml logs -f elasticsearch

shell-front:
	@echo "$(GREEN)💻 Ouverture du shell Frontend...$(RESET)"
	@docker compose -f docker-compose.global.yml exec front sh

shell-back:
	@echo "$(BLUE)💻 Ouverture du shell Backend...$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test bash

restart:
	@echo ""
	@echo "$(YELLOW)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(YELLOW)║   ♻️  Redémarrage complet...            ║$(RESET)"
	@echo "$(YELLOW)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml restart
	@echo "$(GREEN)✓$(RESET) Stack redémarrée"
	@echo ""

restart-front:
	@echo "$(CYAN)🎨 Redémarrage du frontend...$(RESET)"
	@docker compose -f docker-compose.global.yml restart front
	@echo "$(GREEN)✓$(RESET) Frontend redémarré"

restart-back:
	@echo "$(BLUE)⚙️  Redémarrage du backend...$(RESET)"
	@docker compose -f docker-compose.global.yml restart laravel.test
	@echo "$(GREEN)✓$(RESET) Backend redémarré"

clean-cache:
	@echo ""
	@echo "$(MAGENTA)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(MAGENTA)║   💨 Nettoyage de TOUS les caches...   ║$(RESET)"
	@echo "$(MAGENTA)╚════════════════════════════════════════╝$(RESET)"
	@$(MAKE) clean-cache-front
	@$(MAKE) clean-cache-back
	@echo ""
	@echo "$(GREEN)✓$(RESET) Tous les caches vidés"
	@echo ""

clean-cache-front:
	@echo "$(CYAN)🎨 Nettoyage du cache frontend...$(RESET)"
	@docker compose -f docker-compose.global.yml exec front pnpm nuxi cleanup
	@docker compose -f docker-compose.global.yml exec front rm -rf .output dist
	@echo "$(GREEN)✓$(RESET) Cache frontend vidé"

clean-cache-back:
	@echo "$(BLUE)⚙️  Nettoyage du cache backend...$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan cache:clear
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan config:clear
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan route:clear
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan view:clear
	@echo "$(GREEN)✓$(RESET) Cache backend vidé"

es-reindex:
	@echo ""
	@echo "$(MAGENTA)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(MAGENTA)║   🔍 Reindex Elasticsearch...          ║$(RESET)"
	@echo "$(MAGENTA)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan scout:import
	@echo ""
	@echo "$(GREEN)✓$(RESET) Reindex terminé"
	@echo ""

install:
	@echo ""
	@echo "$(GREEN)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(GREEN)║   📦 Installation des dépendances...   ║$(RESET)"
	@echo "$(GREEN)╚════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BLUE)⚙️  Backend Laravel...$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test composer install
	@echo ""
	@echo "$(CYAN)🎨 Frontend Nuxt...$(RESET)"
	@docker compose -f docker-compose.global.yml exec front pnpm install
	@echo ""
	@echo "$(GREEN)✓$(RESET) Installation terminée"
	@echo ""

db-fresh:
	@echo ""
	@echo "$(YELLOW)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(YELLOW)║   🗄️  Reset de la base de données...   ║$(RESET)"
	@echo "$(YELLOW)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test php artisan migrate:fresh --seed
	@echo ""
	@echo "$(MAGENTA)🔍 Reindex Elasticsearch...$(RESET)"
	@$(MAKE) es-reindex
	@echo "$(GREEN)✓$(RESET) Base de données réinitialisée et indexée"
	@echo ""

versions:
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║   📦 Versions de la stack              ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(GREEN)Frontend:$(RESET)"
	@docker compose -f docker-compose.global.yml exec front node --version
	@docker compose -f docker-compose.global.yml exec front pnpm --version
	@docker compose -f docker-compose.global.yml exec front pnpm list nuxt --depth=0 2>/dev/null | grep nuxt || echo "Nuxt: (à installer)"
	@echo ""
	@echo "$(BLUE)Backend:$(RESET)"
	@docker compose -f docker-compose.global.yml exec laravel.test php --version | head -n 1
	@docker compose -f docker-compose.global.yml exec laravel.test composer --version
	@echo ""

health:
	@echo ""
	@echo "$(CYAN)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║   🏥 Santé des services                ║$(RESET)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(RESET)"
	@echo ""
	@docker compose -f docker-compose.global.yml ps
	@echo ""

clean:
	@echo ""
	@echo "$(RED)╔════════════════════════════════════════╗$(RESET)"
	@echo "$(RED)║   🧹 Nettoyage complet...              ║$(RESET)"
	@echo "$(RED)╚════════════════════════════════════════╝$(RESET)"
	@docker compose -f docker-compose.global.yml down -v
	@rm -rf front/node_modules front/.nuxt front/.output front/dist
	@rm -rf back/vendor
	@echo ""
	@echo "$(GREEN)✓$(RESET) Nettoyage terminé"
	@echo ""