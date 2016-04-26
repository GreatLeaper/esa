var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

var counter = -1;
var points_per_click = 1;
var bonus = 0;
var rate_per_minute = 0;
var chapter_id = 0;
var chapter = 1;
var pinch_scale = 0; // This is used as a hack to manually check whether we are pinching in or out.
var next_chapter = 5;
var max_chapter = 1;

var chapters = [ {id:0,  chapter:1, points:0,        bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-001.jpg', message:'Hi.  I\'m Elle, and welcome to the Esa Story Adventure!<br><br>To get started, get Esa\'s attention by tapping on her 5 times.', completed:0, bad_pet_direction:'swipeup'},
                 {id:1,  chapter:2, points:5,        bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-002.jpg', message:'Good job!  When you tap her, you give her a little attention, and she loves that.<BR><BR>This gives you Hearts that you can use later to buy her neat items!', completed:0, bad_pet_direction:'swipeleft'},
                 {id:2,  chapter:2, points:5,        bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-002.jpg', message:'We keep track of Hearts here.', completed:0, bad_pet_direction:'swipeup', element:'#total_hearts_label'},
                 {id:3,  chapter:2, points:5,        bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-002.jpg', message:'Now try petting Esa.  She loves that more than tapping.  Pet her until you get 20 hearts.', completed:0, bad_pet_direction:'swipeup'},
                 {id:4,  chapter:3, points:20,       bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'Excellent!  I\'m sure you noticed the pink bar going up as you pet her.  This is the Heart Bar, and it shows you how close you are to the next chapter in our story.', completed:0, bad_pet_direction:'swipeup'},
                 {id:5,  chapter:3, points:20,       bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'You can see the Chapter you are on here.', completed:0, bad_pet_direction:'swipeup', element:'#chapter_label'},
                 {id:6,  chapter:3, points:20,       bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'And the Hearts needed to unlock the next Chapter here.', completed:0, bad_pet_direction:'swipeup', element:'#next_chapter_label'},
                 {id:7,  chapter:3, points:20,       bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'Now tap and pet her to get 100 hearts, and in Chapter 4, we will go shopping for her!', completed:0, bad_pet_direction:'swipeup'},
                 {id:8,  chapter:4, points:100,      bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'Well done.  Now, let\'s go to the store and buy Esa a collar!', completed:0, bad_pet_direction:'swipeup'},
                 {id:9,  chapter:4, points:100,      bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-003.jpg', message:'Click here to go to the store.', completed:0, bad_pet_direction:'swipeup', element:'#btn_shop'},
                 {id:10, chapter:4, points:'Collar', bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-collar.jpg', message:'Look how cute Esa looks with a collar!', completed:0, bad_pet_direction:'swipeup'},
                 {id:11, chapter:4, points:'Collar', bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-collar.jpg', message:'Every time you buy a new item, you will see a new picture of Esa with that item!', completed:0, bad_pet_direction:'swipeup'},
                 {id:12, chapter:5, points:200,      bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-004.jpg', message:'Click to 500 to see the next pic....', completed:0, bad_pet_direction:'swipeup'},
                 {id:13, chapter:6, points:2000,     bonus:0, narrator_pic:'elle-main.png', esa_pic: 'esa-005.jpg', message:'ad some text....', completed:0, bad_pet_direction:'swipeup'} ]

var products = [ {item:'Cheat',         cost:-1, bonus:101, enabled:1, title:'Cheat?', description:'This is for KAW to get point seasily for testing', owned:0, completed:0 },
                 {item:'Collar',        cost:100, bonus:1, enabled:1, unlocks:[ {product:'Leash'}, {product:'Dog Tag'} ], title:'Buy a collar?', description:'Esa would love a collar.  And if she had one, you can then get her a nametag, and more importantly, a leash so she can go on walks!', owned:0, completed:0 },
                 {item:'Comb',          cost:900, bonus:2, enabled:1, title:'Buy a comb?', description:'Esa likes your hand, but she likes a comb more!', owned:0, completed:0 },
                 {item:'Brush',         cost:2000, bonus:5, enabled:1, title:'Buy a brush?', description:'Oh wow, Esa just loves a brush!', owned:0, completed:0 },
                 {item:'Leash',         cost:50, bonus:0, enabled:0, unlocks:[{selector:'#btn_walks'}], title:'', description:'Buying a leash will allow you to talk Esa on walks!', owned:0, completed:0 },
                 {item:'Ball',          cost:0, bonus:0, enabled:1, title:'', description:'', owned:0, completed:0 },
                 {item:'Chew Toy',      cost:0, bonus:0, enabled:1, title:'', description:'', owned:0, completed:0 },
                 {item:'Painted Nails gjhgjg', cost:0, bonus:0, enabled:1, title:'', description:'', owned:0, completed:0 },
                 {item:'Bone',          cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Stick',         cost:0, bonus:0, enabled:1, title:'', description:'', owned:0, completed:0 },
                 {item:'Frisbee',       cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Beef Jerky',    cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Bacon',         cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Banana',        cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Apple',         cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 },
                 {item:'Bee',           cost:0, bonus:0, enabled:1, title:'', description:'For some reason, Esa loves to eat bees.  Don\'t ask.', owned:0, completed:0 },
                 {item:'Dog Tag',       cost:0, bonus:0, enabled:0, title:'', description:'', owned:0, completed:0 } ]

var walks = [ {walk:'school', cost:10000, bonus:10, duration:10, enabled:1, title:'Walk to school', description:'Esa loves walking to the school.  More details....', end_text:'The walk is over.'},
              {},
              {} ]

var hirees = [ {hiree:'Susie',   cost:1000, rate:10, title:'Hire Susie?', description:'Susie is the kid next door.  She\'s not the best at taking care of dogs, but Esa loves licking her face!', hired:0 },
               {hiree:'Ava',     cost:2000, rate:15, title:'Hire Ava?', description:'Ava is a good friend down the street.  Smart, a good friend, and great with dogs.', hired:0 },
               {hiree:'Kevin',   cost:3000, rate:30, title:'Hire Kevin?', description:'Kevin is the bee\'s knees when it comes to dog walking.  He\'s a pro.', hired:0 },
               {hiree:'Marlen',  cost:4000, rate:45, title:'Hire Marlen?', description:'something about a vet', hired:0 },
               {hiree:'C-Zar',   cost:5000, rate:60, title:'Hire C-Zar?', description:'something about a dog whisperer', hired:0 },
               {hiree:'Caity',   cost:5500, rate:65, title:'Hire Caity?', description:'She has an English Mastif so she is definetly good at dog sitting, P.S. He is HUGE!', hired:0 } ]

$(document).on("deviceready", function() {
  deviceReadyDeferred.resolve();
});

$(document).on("mobileinit", function () {
  jqmReadyDeferred.resolve();
});

$.when(deviceReadyDeferred, jqmReadyDeferred).then(init);

function init() {
}

// Index Page
$(window).bind("load", function() {

   var esa = $('#esa')[0];

   var mc = new Hammer(esa);
   mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
   mc.get('pinch').set({ enable: true });

   mc.on("press", function(ev) {
       alert('No!  Don\'t push too hard!');
   });

   mc.on("tap", function(ev) {
       givePoints(1);
   });

   mc.on("swipeup swipedown swipeleft swiperight", function(ev) {
     if (ev.type == chapters[chapter_id].bad_pet_direction) {
       alert('No!  Don\'t pet me against my fur!');
     } else {
       givePoints(2);
     }
   });

   mc.on("pinchstart", function(ev) {
       pinch_scale = ev.scale;
   });

   mc.on("pinchend", function(ev) {
     if (pinch_scale > ev.scale) {
       alert('Ouch!  Don\'t pinch!');
     } else {
       givePoints(3);
     }
   });

   max_chapter_id = Math.max.apply(null, chapters.map(function(c){return c.id;}))

   setPointsPerMinute();
});

// Store Page
// Use pagebeforecreate instead of pageinit so that it fires before jquery widgets are initialized
// See https://demos.jquerymobile.com/1.2.0/docs/pages/page-scripting.html
$( document ).delegate("#store", "pagebeforecreate", function() {
  populateStoreList();
});

function givePoints(gesture_point) {
  points_per_click = gesture_point + bonus;
  counter = counter + points_per_click;
  refreshPoints();
  nextChapter();
}

function setPointsPerMinute() {
  if (rate_per_minute > 0) {
    counter = counter + 1;
    refreshPoints();
    nextChapter();
  }
  setTimeout(setPointsPerMinute, 1000 * (60/rate_per_minute));
}

function refreshPoints() {
  $('#total_pets')[0].innerHTML = counter;
  $('#pets_per_click')[0].innerHTML = points_per_click;
  $('#chapter')[0].innerHTML = chapter;

  progress(counter, $('#heart_bar'));

  if ($('#store_total_pets').length != 0) {
    $('#store_total_pets')[0].innerHTML = counter;
  }

  if ($('#hire_total_pets').length != 0) {
    $('#hire_total_pets')[0].innerHTML = counter;
  }
}

// http://workshop.rs/2012/12/animated-progress-bar-in-4-lines-of-jquery/
function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / next_chapter;
    $element.find('div').width(progressBarWidth).html(percent + '&nbsp;&nbsp;');
}

function closePopup() {
  // Show narrator in bottom left corner
  $('#narrator').show();

  // See if we have another popup to show
  setTimeout(nextChapter, 500); // Change this.  Instead of wait 500ms, look for the existence of an element
}

function showPopup(id) {

  // Set element to position to
  if ('element' in chapters[id]) {

    // Note: The link needs to be dynamic or the data-position-to doesn't work.

    // create a dynamic a selector
    $('<a>', {
      id: 'btn_positioned_' + id,
      href: '#popupPositioned',
      'data-rel': 'popup',
      'data-position-to': chapters[id].element,
      text: 'Popup Positioned',
      class: 'ui-btn ui-corner-all ui-shadow ui-btn-inline',
    }).appendTo('#popupLinks');

    // Set popup message
    $('#popupPositioned label').html(chapters[id].message);

    // popup the message
    $('#btn_positioned_' + id).click();

  } else {

    $('#narrator').hide();

    $('#btn_next').click();

    // Remove the ui-overlay-shadow class from popupChapter
    $('#popupChapter').removeClass('ui-overlay-shadow')

    // Show this chapter's specific info
    $('#chapter_text label').html(chapters[id].message);
    $('#chapter_footer #elle').attr('src', 'images/elle/' + chapters[id].narrator_pic);

  }

  // Mark it as completed
  chapters[id]["completed"] = 1;
}

function nextChapter() {

  // Get any owned and not completed products
  var owned = $.grep(products, function(e){ return e.owned == 1 && e.completed == 0; });

  // Check for points achieved
  for (i = 0; i < chapters.length; i++) {
    if (counter >= chapters[i]["points"] && chapters[i]["completed"] == 0) {

      // Set up the next chapter
      chapter_id = chapters[i].id;
      chapter = chapters[chapter_id].chapter;
      bonus = bonus + chapters[chapter_id].bonus;
      points_per_click = 1 + bonus;
      next_chapter = chapters[chapter_id+1].points;
      var j=1;
      while ($.isNumeric(next_chapter) == false) {
        j++;
        next_chapter = chapters[chapter_id+j].points;
      }
      $('#next_chapter')[0].innerHTML = next_chapter;
      refreshPoints();

      // Show the next pic and Elle's messages
      showEsa(chapters[chapter_id].esa_pic);
      showPopup(chapter_id);
      return;
    }

    // Check for products just bought
    if (owned.length > 0) {
      if (owned[0].item == chapters[i].points && chapters[i]["completed"] == 0) {
        chapters[i]["completed"] = 1;
        showEsa(chapters[i].esa_pic);
        showPopup(chapters[i].id);
        return;
      }
    }
  }
}

function populateStoreList() {

  var owned = '';
  var row_style = '';
  var href = '';

  // Clear out the list first
  $("#items").empty();

  // Load products
  for (i = 0; i<products.length; i++ ) {

    if (products[i].owned == 1) { owned = '<img src="images/buttons/owned.png" class="ui-li-icon ui-corner-none">' } else { owned = '' }
    if (products[i].enabled == 1) {
      row_style = '';
      href = 'href = "#popup"';
    } else {
      row_style = 'color: gray;'; // just make this disabled
      href = '';
    }

    $("#items").append('<li><a onclick="populateStoreItem(\'' + products[i].item + '\');" ' + href + ' \
                          data-role="button" data-rel="popup" data-transition="slidefade" data-inline="true" \
                          data-corners="true" data-shadow="true"> \
                            <div class="ui-grid-b" style="' + row_style + '"> \
                              <div class="ui-block-a"><img src="../_assets/img/gf.png" class="ui-li-icon ui-corner-none">' +
                              products[i].item + '</div>' +
                              '<div class="ui-block-b">$' + products[i].cost + '</div>' +
                              '<div class="ui-block-c">' + owned + '</div>' +
                            '</div>' +
                            '</a></li>');

    // Re-initialize the jquery mobile widget so it redraws
    $("#items").trigger("create");
  }
}

function populateStoreItem(item) {
  // Find the item in the products array
  var storeItem = $.grep(products, function(e){ return e.item == item; });

  if (storeItem.length == 0) {
    alert('no such item yo!');
  } else {
    // item found
    $('#store_title')[0].innerHTML = storeItem[0].title;
    $('#store_description')[0].innerHTML = storeItem[0].description;
    $('#store_item_cost')[0].innerHTML = storeItem[0].cost;
    $('#store_pets_per_click')[0].innerHTML = storeItem[0].bonus;
    $('#store_total_pets')[0].innerHTML = counter;
    $('#store_buy')[0].onclick = function() { buy(item) };
    refreshPoints();
  }
}

// Unlocks products, walks, specific selectors
function unlock(items) {
  // product: .... the <product> in the store!
  // walk:    .... Esa is able to walk to the <walk> now!
  // selector: maybe don't do this.  or we need a genenral one.

  for (i = 0; i<items.length; i++ ) {
    if ('product' in items[i]) {
      alert('You just unlocked the ' + items[i].product + ' in the store!');
        var product = $.grep(products, function(e){ return e.item == items[i].product; });
        product[0].enabled = 1;
    } else if ('walk' in items[i]) {
      alert('You can now walk with Esa to the ' + items[i].walk + '!');
    } else if ('selector' in items[i]) {
      alert('You can now.... ' + items[i].something + '! Click here!');
    }
  }
}

function buy(item) {
  // Find the item in the products array
  var purchased = $.grep(products, function(e){ return e.item == item; });

  if (purchased.length == 0) {
    alert('no such item yo!');
  } else if (purchased[0].owned == 1) {
    alert('You already own the ' + purchased[0].item);
  } else {
    // item found
    if (counter < purchased[0].cost) {
      alert('You don\'t have enough hearts.  Go pet Esa some more.');
    } else {
      counter = counter - purchased[0].cost;
      bonus = bonus + purchased[0].bonus;
      points_per_click = 1 + bonus;
      purchased[0]["owned"] = 1;
      refreshPoints();
      alert('Congratulations! Your pet is now worth ' + purchased[0].bonus + ' more!')

      // Show anything they unlocked
      if ('unlocks' in purchased[0]) {
        unlock(purchased[0].unlocks);
      }

      populateStoreList();
    }
  }
}

function populateHirees(hiree) {
  // Find the hiree in the hirees array
  var person = $.grep(hirees, function(e){ return e.hiree == hiree; });

  if (person.length == 0) {
    alert('no such person yo!');
  } else {
    // person found
    $('#hire_title')[0].innerHTML = person[0].title;
    $('#hire_description')[0].innerHTML = person[0].description;
    $('#hire_item_cost')[0].innerHTML = person[0].cost;
    $('#hire_pets_per_minute')[0].innerHTML = person[0].rate;
    $('#hire_total_pets')[0].innerHTML = counter;
    $('#hire')[0].onclick = function() { hire(hiree) };
    refreshPoints();
  }
}

function hire(hiree) {
  // Find the hire in the hirees array
  var person = $.grep(hirees, function(e){ return e.hiree == hiree; });

  if (person.length == 0) {
    alert('no such person yo!');
  } else {
    // item found
    if (counter < person[0].cost) {
      alert('You don\'t have enough pet points.  Go pet Esa some more.');
    } else if (person[0].hired == 1) {
      alert('You have already hired ' + hiree + '!');
    } else {
      counter = counter - person[0].cost;
      rate_per_minute = rate_per_minute + person[0].rate;
      person[0].hired = 1;
      refreshPoints();
      alert('Congratulations! You hired ' + hiree + '!');
    }
  }
}

function nextPic(adjustment) {
  prev_pic = chapters[chapter_id].esa_pic;
  next_id = chapter_id + adjustment;

  do {
    // Flee if chapter not completed
    if (chapters[next_id].completed == 0 ) { next_id = next_id - adjustment; break; }
    // Flee if at first chapter
    if (next_id < 0) { next_id = 0; break; }
    // Flee if at last chapter
    if (next_id > max_chapter_id) { next_id = max_chapter_id; break; }
    // Flee if pic changed (we want this)
    if (prev_pic != chapters[next_id].esa_pic) { break; }
    // Let's try the next chapter
    next_id = next_id + adjustment;
  } while (true);

  chapter_id = next_id;
  chapter = chapters[chapter_id].chapter;
  refreshPoints();
  showEsa(chapters[chapter_id].esa_pic);
}

// Show the esa image based on the id passed in
// All images are in the format 'esa-id.jpg'
function showEsa(img) {
  document.getElementById('esa').src = "images/" + img;
}

// Pad leading 0s
// Max 999
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
}
