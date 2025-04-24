/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 */
/*
 * This is not the original jQuery Superfish plugin.
 * Please refer to the README for more information.
 */

(function($){
  $.fn.superfish = function(superfish_options){
    var cssClasses = sf.cssClasses;
    var $arrow = $(`<span class="${cssClasses.arrowClass}"> &#187;</span>`);

    var over = function(){
      var $$ = $(this);
      var menu = getMenu($$);
      clearTimeout(menu.sfTimer);
      $$.showSuperfishUl().siblings().hideSuperfishUl();
    };

    var out = function(){
      var $$ = $(this);
      var menu = getMenu($$);
      var options = sf.options;

      clearTimeout(menu.sfTimer);
      menu.sfTimer = setTimeout(function(){
        if ($$.children('.sf-clicked').length == 0){
          options.retainPath = ($.inArray($$[0], options.$path) > -1);
          $$.hideSuperfishUl();
          if (options.$path.length && $$.parents(`li.${cssClasses.hoverClass}`).length < 1){
            over.call(options.$path);
          }
        }
      }, options.delay);
    };

    var getMenu = function($menu){
      var menu = $menu.parents(`ul.${cssClasses.menuClass}:first`)[0];
      sf.options = sf.optionsList[menu.serial];
      return menu;
    };

    var addArrow = function($a){
      $a.addClass(cssClasses.anchorClass).append($arrow.clone());
    };

    return this.each(function() {
      var s = this.serial = sf.optionsList.length;
      var options = $.extend({}, sf.defaults, superfish_options);
      options.$path = $(`li.${options.pathClass}`, this).slice(0, options.pathLevels);
      var path = options.$path;
      for (var l = 0; l < path.length; l++){
        path.eq(l).addClass(`${cssClasses.hoverClass} ${cssClasses.bcClass}`).filter('li:has(ul)').removeClass(options.pathClass);
      }
      sf.optionsList[s] = sf.options = options;

      $('li:has(ul)', this)[($.fn.hoverIntent && !options.disableHI) ? 'hoverIntent' : 'hover'](over, out).each(function() {
        if (options.autoArrows) {
          addArrow( $(this).children('a:first-child, span.nolink:first-child') );
        }
      })
      .not('.' + cssClasses.bcClass).hideSuperfishUl();

      var $a = $('a, span.nolink', this);
      $a.each(function(i){
        var $li = $a.eq(i).parents('li');
        $a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});
      });
      options.onInit.call(this);

    }).each(function() {
      var menuClasses = [cssClasses.menuClass];
      if (sf.options.dropShadows){
        menuClasses.push(cssClasses.shadowClass);
      }
      $(this).addClass(menuClasses.join(' '));
    });
  };

  var sf = $.fn.superfish;
  sf.optionsList = [];
  sf.options = {};

  sf.cssClasses = {
    bcClass: 'sf-breadcrumb',
    menuClass: 'sf-js-enabled',
    anchorClass: 'sf-with-ul',
    arrowClass: 'sf-sub-indicator',
    shadowClass: 'sf-shadow',
    hiddenClass: 'sf-hidden',
    hoverClass: 'sfHover'
  };

  sf.defaults = {
    pathClass: 'overideThisToUse',
    pathLevels: 1,
    delay: 800,
    animation: {opacity: 'show'},
    speed: 'fast',
    autoArrows: true,
    dropShadows: true,
    disableHI: false, // true disables hoverIntent detection
    onInit: function(){}, // callback functions
    onBeforeShow: function(){},
    onShow: function(){},
    onHide: function(){}
  };

  $.fn.extend({
    hideSuperfishUl : function(){
      var options = sf.options;
      var not = options.retainPath === true ? options.$path : '';
      options.retainPath = false;
      var $ul = $(`li.${sf.cssClasses.hoverClass}`, this).add(this).not(not).removeClass(sf.cssClasses.hoverClass)
          .children('ul').addClass(sf.cssClasses.hiddenClass);
      options.onHide.call($ul);
      return this;
    },
    showSuperfishUl : function(){
      this.removeClass(sf.cssClasses.hiddenClass);
      var options = sf.options;
      var $ul = this.addClass(sf.cssClasses.hoverClass).children(`ul.${sf.cssClasses.hiddenClass}`).hide().removeClass(sf.cssClasses.hiddenClass);
      options.onBeforeShow.call($ul);
      $ul.animate(options.animation, options.speed, function(){ options.onShow.call($ul); });
      return this;
    }
  });

})(jQuery);
