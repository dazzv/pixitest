const app = new PIXI.Application({
    resizeTo: window,
    background: "#545454",
    antialias: true,
})
document.body.appendChild(app.view)
app.renderer.view.position = 'absolute';
app.renderer.view.autoResize = true;
app.stage.interactive = true
app.stage.hitArea = app.screen

// Создаем контейнер
const container = new PIXI.Container()
app.stage.addChild(container)
container.children.interactive = false
container.sortableChildren = true

const width = app.screen.width / 2;
const height = app.screen.height / 5;

// создаем спрайти
const parking = PIXI.Sprite.from("./src/parking.png");
parking.anchor.set(0.5)
parking.x = width;
parking.y = height;
parking.interactive = false
container.addChild(parking)

const yelP = PIXI.Sprite.from("./src/P.png")
yelP.position.set(-65+ width, 160 + height)
yelP.anchor.set(0.5)
container.addChild(yelP)

const redP = PIXI.Sprite.from("./src/P2.png")
redP.position.set(65 + width, 160 + height)
redP.anchor.set(0.5)
redP.interactive = true 
container.addChild(redP)

const fail = PIXI.Sprite.from('./src/FAIL.png')
fail.anchor.set(0.5)
fail.position.set(width, app.screen.height / 2)

const logo = PIXI.Sprite.from("./src/Logo.png")
logo.anchor.set(0.5)
logo.position.set(width, app.screen.height / 4)
logo.interactive = false;
logo.alpha = 0;
logo.scale.set(0);

//создаем интерактивные спрайти
const redCar = PIXI.Sprite.from("./src/redcar.png")
redCar.anchor.set(0.5)
redCar.position.set(-120 + width, app.screen.height / 1.2)
redCar.interactive = true
redCar.cursor = 'pointer'
container.addChild(redCar)

const yelCar = PIXI.Sprite.from("./src/yellowcar.png")
yelCar.anchor.set(0.5)
yelCar.position.set(120 + width, app.screen.height / 1.2)
yelCar.interactive = true
yelCar.cursor = 'pointer'
container.addChild(yelCar)

const button = PIXI.Sprite.from("./src/button.png")
button.position.set(width, app.screen.height / 1.5)
button.anchor.set(0.5)
button.interactive = true; button.cursor = 'pointer';
button.alpha = 0;
button.scale.set(0);

const points = [];
const points2 = [];
let whatCar = null
let whatP = null

//начало пути
function onPointerDown(carPos, e) {
  let path = new PIXI.Graphics();
  path.zIndex = -1
  path.moveTo(e.x, e.y);
  // настройка линии и определение машины
  if(carPos === redCar.x){
    path.lineStyle({
      width: 10,
      color: '#cc0000',
      cap: 'round'
    });
    whatCar = redCar; whatP = redP;

  } else if(carPos === yelCar.x) {
    path.lineStyle({
      width: 10,
      color: '#ffd966',
      cap: 'round'
    });
    whatCar = yelCar; whatP = yelP;
  }

  if(whatCar === redCar){
    points.push({x: e.x, y: e.y})
  } else{
    points2.push({x: e.x, y: e.y})
  }

  // рисуем линию
  function onPointerMove(e) {
      let x = e.x;
      let y = e.y;
      x = x | 0;
      y = y | 0;
      path.lineTo(x, y);
      if(whatCar === redCar){
        points.push({x: e.x, y: e.y})
      } else{
        points2.push({x: e.x, y: e.y})
      }
      if(points.length > 0){
        if(e.y > points[0].y + 30){
          app.stage.removeListener('pointermove', onPointerMove);
        }
      }
        
      
  }

  function onPointerUp(e) {
    app.stage.removeListener('pointermove', onPointerMove);    
    // смотрим дистанцию до нужной парковки
    const distance = e.getLocalPosition(whatP)
    let isOnParking = false;
      // добавляем линию если это нужная парковка
    if(whatCar.interactive){
      container.addChild(path); 
      if(distance.x < 30 && distance.x > -30 && distance.y < 30 && distance.y > -30){
        whatCar.interactive = false
      }
      else {
        setTimeout(() => {
          container.removeChild(path);
        }, 500);
      }
    }   
     
    // если оба пути нарисованы // находим точку пересечения
    if(!redCar.interactive && !yelCar.interactive){

      // Вычисляем точку пересечения с использованием всех точек
      let intersectionX = NaN;
      let intersectionY = NaN;
      for (const p1 of points) {
        for (const p2 of points2) {
          if (p1.x >= p2.x && p1.x <= p2.x + 10 && p1.y >= p2.y && p1.y <= p2.y + 10) {
            intersectionX = p1.x;
            intersectionY = p1.y;
            break;
          }
        }
        if (!isNaN(intersectionX) && !isNaN(intersectionY)) {
          break;
        }
      }

      // Проверка наличия точки пересечения
      if (!isNaN(intersectionX) && !isNaN(intersectionY)) {
        // Точка пересечения существует, можно выполнить дополнительные действия
         // задаем координаты для машин
         var tweenR = new TWEEN.Tween(redCar) 
         tweenR.to({x: intersectionX - 20, y: intersectionY}, 1000)
 
         var tweenY = new TWEEN.Tween(yelCar)
         for(let i = 0; i < points2.length - 5; i++) {  
           tweenY.to({x: intersectionX + 20, y: intersectionY}, 1000)
         }
 
         // запускаем анимацию
         tweenR.start()
         tweenY.start()
         animate()
         function animate() {
           requestAnimationFrame(animate)
           redCar.rotation = 0.2
           yelCar.rotation = -0.2
           TWEEN.update()
           // [...]
         }

         
         setTimeout(() => {
          container.addChild(fail) 
          setTimeout(() => {
            finished()
            container.removeChild(container.children[0])
            container.removeChild(path)
                        
          }, 1000);
         }, 1300);
        
        // const tweens = [];

        // for(let i = 1; i < points.length; i ++){
        //   const tween = new TWEEN.Tween(redCar)
        //   .to(points[i], 1000)
        //   tween._valuesStart = points[i - 1]
        //   tweens.push(tween)
        // }
        // Запускаем tween-анимацию     
        // tweens.forEach(function(tween){
        //   tween.start()
        // })
        // for (var i = 0; i < tweens.length; i++) {
        //   tweens[i].start();
        // }
         
        // Выполняем обновление анимации в каждом кадре
        // function animate() {
        //   requestAnimationFrame(animate);
        //   TWEEN.update();
       // Дополнительные действия, если необходимо
        // }
        // animate() 
      } else {
      // Точка пересечения не существует
      location.reload()
    }}}

  app.stage.on('pointermove', onPointerMove);
  app.stage.once('pointerup', onPointerUp);
}

const finished = () => {
  container.removeChild(fail)
  // location.reload()
  // создаем финальную сцену
  let overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000, 0.5);
  overlay.drawRect(0, 0, app.screen.width, app.screen.height)
  overlay.endFill();
  app.stage.addChild(overlay)

  // logo.scale.set(0.5);
  app.stage.addChild(logo)
  app.stage.addChild(button)
  
  setTimeout(() => {
    location.reload()
    
  }, 10000);

  function setup() {  
    // Анимация появления кнопки
    app.ticker.add(function (delta) {
        if (button.alpha < 1) {
            button.alpha += 0.01 * delta;
            button.scale.x += 0.01 * delta;
            button.scale.y += 0.01 * delta;
        }
    });
    // Анимация появления логотипа
    app.ticker.add(function (delta) {
        if (logo.alpha < 1) {
            logo.alpha += 0.01 * delta;
            logo.scale.x += 0.01 * delta;
            logo.scale.y += 0.01 * delta;
        }
    });
  }
  setup()     

}

const goTo = () => {
  window.open('https://roasup.com/');
}

// адаптация экрана под мобильных устройств
if(app.screen.width < 600){
  parking.scale.set(0.65)
  parking.y = height - 25
  redP.scale.set(0.75)
  redP.position.set(45 + width, 75 + height)
  yelP.scale.set(0.75)
  yelP.position.set(-40 + width, 75 + height)
  redCar.scale.set(0.75)
  yelCar.scale.set(0.75)
  redCar.position.set(-80 + width, app.screen.height / 1.3)
  yelCar.position.set(80 + width, app.screen.height / 1.3)
  fail.scale.set(0.75)
  button.position.set(width, app.screen.height / 1.7)
  button.alpha = 0.4;
  logo.alpha = 0.4;
  // logo.scale.set(0.65)
  // button.scale.set(0.7)
  
}
if(app.screen.height < 700){
  parking.scale.set(0.65)
  parking.y = height - 30
  redP.scale.set(0.75)
  redP.position.set(45 + width, 70 + height)
  yelP.scale.set(0.75)
  yelP.position.set(-45 + width, 70 + height)
  redCar.scale.set(0.7)
  redCar.x = -90 + width
  yelCar.x = 90 + width
  yelCar.scale.set(0.7)
  fail.scale.set(0.65)
  button.position.set(width, app.screen.height / 1.3)
  // logo.scale.set(0.65)
  // button.scale.set(0.65)
  button.alpha = 0.4;
  logo.alpha = 0.4;

}
redCar.on('pointerdown', onPointerDown.bind(null, redCar.x));
yelCar.on('pointerdown', onPointerDown.bind(null, yelCar.x));
button.on('pointerdown', goTo)

// Устанавливаем таймер на 20 секунд
var timer = setTimeout(showFinalScene, 20000);
function resetTimer() {
    // Сбрасываем таймер
    clearTimeout(timer);
    // Запускаем таймер заново
    timer = setTimeout(showFinalScene, 20000);
}
function showFinalScene() {
    finished()
}
// Добавляем обработчик события для отслеживания взаимодействия пользователя с страницей
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);