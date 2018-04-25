//jshint node: true, esversion: 6
// ładujemy wykorzystywane moduły:

// express – jako „podstawa aplikacji”
const express = require('express');
// body-parser – żeby móc parsować dane przychodzące w zapytaniu
const bodyParser = require('body-parser');
const path = require('path');
// A do czego może nam być potrzebny moduł cookie-session? ;)
const cookieSession = require('cookie-session');
// drobiazgi do sprawnego i czytelnego logowania
const logger = require('morgan');
const errorHandler = require('errorhandler');

// parametry – ewentualnie przekazywane poprzez zmienne środowiskowe
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || '$uper $ecret';
const env = process.env.NODE_ENV || 'development';

// tworzymy i konfigurujemy obiekt aplikacji
const app = express();

// obsługa danych typu application/json
app.use(bodyParser.json());
// obsługa sesji za pomocą ciasteczek
app.use(cookieSession({secret: secret}));
// „serwer statyczny”
app.use(express.static(path.join(__dirname, 'public')));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ('development' === env) {
  app.use(logger('dev'));
  app.use(errorHandler());
} else {
  app.use(logger('short'));
}

// importujemy moduł gry
const game = require('./game');

// Dwie podstawowe usługi do zaimplementowania (funkcje play i mark)
app.post('/play', game.newGame);
app.post('/mark', game.markAnswer);

// uruchamiamy aplikację
app.listen(port, () => {
  console.log(`Serwer gry dostępny na porcie ${port}`);
});
