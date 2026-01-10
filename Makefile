.PHONY: deploy

deploy:
	ssh nodejs@ibiza.ru 'cd ibiza-ru-frontend && git pull && npm run build'
