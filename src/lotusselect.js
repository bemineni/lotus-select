// 	     OM
// Srikanth Bemineni
// Lotus Select
// This plugin adds some spice to the select 

(function($){

	$.fn.lotusSelect = function(options){

         
         function lotusSelect(element, options)
         {
         	  var selectElem = element;
         	  var lotusContainer;
         	  var selectParent;
         	  var selectOptions;
         	  var elemheight;
         	  var elemwidth;
              this.init = function(){
                  selectOptions  = $.extend({},$.fn.lotusSelect.defaultOptions , options);
                  selectParent = $(selectElem).parent()[0];
                  createStructure();
                  setupValues();
                  postSetup();
              };

              this.closeDropDown = function(){
                  hide();
              };

              this.resetSelect = function(){
                  setupValues();
                  postSetup();
              };

              function createStructure()
              {
              	 elemheight = $(selectElem).outerHeight(true);
              	 elemwidth = $(selectElem).outerWidth(true);
                 lotusContainer = "lotusContainer_" + $(selectElem).attr('id');
              	 $(selectElem).before("<div id='" + lotusContainer +"' class='lotusSelect-main'></div>");
              	 lotusContainer = $("#"+lotusContainer)[0];
                 $(lotusContainer).prepend($(selectElem).detach());
                 $(selectElem).addClass("lotusSelect-select");
                 $(lotusContainer).append(['<div class="lotusSelect-clickable">',
                                                '<a>',
                                                    '<span id="lotus-selection"></span>',
                                                    '<div>',
                                                      '<b class="lotusSelect-down-icon"></b>',
                                                    '</div>',
                                                '</a>',
                                           '</div>'].join('\n'));
                 $(lotusContainer).append(['<div class="lotusSelect-dropDown">',
                                              '<div class="lotusSelect-help">',
                                                '<input type="text" class="lotusSelect-search-icon"></input>',
                                              '</div>',
                                              '<div class="lotusSelect-list">',
                                                '<ul></ul>',
                                              '</div>',
                                            '</div>'].join('\n'));

                 //******************* Width *********************

                 if(selectOptions.width === "inherit")
                 {
                     $(lotusContainer).css({ width: elemwidth });
                 }
                 else if(selectOptions.width !== "auto")
                 {
                     $(lotusContainer).css({width: selectOptions.width });
                     //Drop down width will always inherit the select element width.
                     $(".lotusSelect-dropDown",$(lotusContainer)).css({ width: elemwidth });
                 }

                 $('.lotusSelect-dropDown',$(lotusContainer)).css("width",elemwidth);

                 //******************* Heigth *********************

                 if(selectOptions.height === "inherit")
                 {
                     $('.lotusSelect-clickable a',$(lotusContainer)).css({ height: elemheight });
                     $('.lotusSelect-clickable a span',$(lotusContainer)).css({ "line-height": elemheight });
                     $('.lotusSelect-help input',$(lotusContainer)).css({ height: elemheight });
                 }
                 else if(selectOptions.height !== "none")
                 {
                     $('.lotusSelect-clickable a',$(lotusContainer)).css({ height: selectOptions.height });	
                     $('.lotusSelect-clickable a span',$(lotusContainer)).css({ "line-height": selectOptions.height });
                     $('.lotusSelect-help input',$(lotusContainer)).css({ height: selectOptions.height });
                 }

                 

                 //******************* padding *********************

                 //Let copy the padding from select to clickable
                 if(selectOptions.padding === "inherit" )
                    $(".lotusSelect-clickable a",$(lotusContainer)).css({ padding: $(selectElem).css('padding'),
                                                                          margin: $(selectElem).css('margin')});

                //******************* border *********************
                // The border will be applied to whole container.Border will appear when the select is expanded.
                if(selectOptions.border)
                {
          		      $('.lotusSelect-clickable',$(lotusContainer)).addClass("lotusSelect-border");
                }

                //******************* shadow *********************
                if(selectOptions.shadow)
                {
                    $(lotusContainer).addClass("lotusSelect-shadow");
                }

                //******************* Background color *********************
                
                $(".lotusSelect-clickable",$(lotusContainer)).css("background-color",selectOptions.backgroundColor);
                $(".lotusSelect-dropDown",$(lotusContainer)).css("background-color",selectOptions.backgroundColor);
                
                //*********************Connections****************

                $(".lotusSelect-clickable",$(lotusContainer)).on("click" , function(e){ selectClicked(e); });

                $(".lotusSelect-list",$(lotusContainer)).on("click" , "ul li" , function(e){ valueSelected(e); });

                $('html').on("click" , function(e){hide(e)});

                $(".lotusSelect-dropDown",$(lotusContainer)).on('click',function(e){ e.stopPropagation();});

                $(".lotusSelect-help input",$(lotusContainer)).on('keyup',function(e){ searchEntered(e); });
                $(".lotusSelect-help input",$(lotusContainer)).on('change',function(e){ searchEntered(e); });

              }

              function setupValues()
              {
              	 var ul = $('.lotusSelect-dropDown ul',$(lotusContainer));
                 ul.html("");
                 var lielem;
                 $('option' , selectElem).each(function(){
                       lielem = $("<li>"+ $(this).text() + "</li>");
                       if($(this).is(':selected'))
                          lielem.addClass('lotusSelect-chosen');
                       ul.append(lielem);
                 });
                 $('.lotusSelect-clickable a span',$(lotusContainer)).text($("select option:selected" , $(lotusContainer)).text());
              }

              function postSetup()
              {
                  //Let get height of each li
                  $(".lotusSelect-dropDown",$(lotusContainer)).show();
                  var liheight = $('.lotusSelect-list ul li',$(lotusContainer)).outerHeight(true);
                  var numSelectables = $('.lotusSelect-list ul li',$(lotusContainer)).length;
                  var maxscrollItems = ( numSelectables > selectOptions.maxScrollShowItems ) ? selectOptions.maxScrollShowItems : numSelectables
                  if(liheight !== null)
                  {
                     $('.lotusSelect-list',$(lotusContainer)).css('height',(liheight * maxscrollItems).toString() + 'px' );
                  }
                  overallheight = 0;
                  $('.lotusSelect-dropDown',$(lotusContainer)).children().each(function(){
                     overallheight += $(this).outerHeight(true);
                  });
                  $('.lotusSelect-dropDown',$(lotusContainer)).css("height",overallheight.toString() + "px");
                  $(".lotusSelect-dropDown",$(lotusContainer)).hide();


              }

              function hide(e)
              {
                if(!$(".lotusSelect-dropDown", $(lotusContainer)).is(":visible"))
                  return;

                $(".lotusSelect-dropDown",$(lotusContainer)).slideUp(300,function(){  });

                if(selectOptions.width === "auto")
                  $('.lotusSelect-clickable',$(lotusContainer)).css("width" , "auto");

                 //reset the drop width
                 $(".lotusSelect-dropDown",$(lotusContainer)).css("width",elemwidth.toString() + "px");
                 $(".lotusSelect-clickable a b",$(lotusContainer)).removeClass("lotusSelect-up-icon");
                 $(".lotusSelect-clickable a b",$(lotusContainer)).addClass("lotusSelect-down-icon");

                 if($(".lotusSelect-help input",$(lotusContainer)).val().length > 0)
                      clearSearchResults();
                 
               }

              function toggleDropDownAnimation()
              {
                if($(".lotusSelect-dropDown", $(lotusContainer)).is(":visible"))
                {
                    //We need to hide it
                    //Animate hide then resize
                    $(".lotusSelect-dropDown",$(lotusContainer)).slideToggle(300,function()
                                { 
                                  if(selectOptions.width === "auto")
                                    $('.lotusSelect-clickable',$(lotusContainer)).css("width" , "auto"); 
                                });
                    

                    //reset the drop width
                    $(".lotusSelect-dropDown",$(lotusContainer)).css("width",elemwidth.toString() + "px");
                    $(".lotusSelect-clickable a b",$(lotusContainer)).removeClass("lotusSelect-up-icon");
                    $(".lotusSelect-clickable a b",$(lotusContainer)).addClass("lotusSelect-down-icon");

                    if($(".lotusSelect-help input",$(lotusContainer)).val().length > 0)
                      clearSearchResults();
                    
                }
                else
                {
                    // show it
                    dropwidth = $(".lotusSelect-dropDown",$(lotusContainer)).outerWidth(true);
                    containerwidth = $(lotusContainer).outerWidth(true);
                    if( dropwidth > containerwidth)
                    {
                       //change the container width
                       $('.lotusSelect-clickable',$(lotusContainer)).animate({"width": dropwidth.toString() + "px"},300);
                    }
                    else
                    {
                       //change the drop width
                       $(".lotusSelect-dropDown",$(lotusContainer)).css("width",containerwidth);
                    }
                    $(".lotusSelect-dropDown",$(lotusContainer)).slideToggle(300);
                    $(".lotusSelect-clickable a b",$(lotusContainer)).removeClass("lotusSelect-down-icon");
                    $(".lotusSelect-clickable a b",$(lotusContainer)).addClass("lotusSelect-up-icon");   
                }
              }

              function closeOtherSelects()
              {
                 var id = $(lotusContainer).prop("id");
                 $('.lotusSelect-main').each(function(){
                        if($(this).prop('id') !== id )
                        {
                           $('select',$(this)).lotusSelect('closeDropDown');
                        }
                 })
              }

              function selectClicked(e)
              {
                 //This will close any opened
                 closeOtherSelects();
              	 toggleDropDownAnimation();
              	 //If the anchor was clicked
                 e.preventDefault();
                 e.stopPropagation();
              }

              function valueSelected(e)
              {
                var lielem = e.target || e.srcElement;

                //The user has selected the option which is already selected
                if($(lielem).hasClass("lotusSelect-chosen"))
                  return;

                //Lets remove the old selection class
                $(".lotusSelect-list ul li.lotusSelect-chosen",$(lotusContainer)).removeClass("lotusSelect-chosen");
              	setSelectValue($.trim($(lielem).text()));
                $(lielem).addClass("lotusSelect-chosen");
              	$('.lotusSelect-clickable a span',$(lotusContainer)).text($("select option:selected",$(lotusContainer)).text());
              	//close the drop down
              	toggleDropDownAnimation();
                e.preventDefault();
                e.stopPropagation();
              }

              function setSelectValue( value )
              {

                $("select option",$(lotusContainer)).filter(function() {
    					         //may want to use $.trim in here
    					         return $(this).text() === value; 
                    }).prop('selected', true);

                $("select",$(lotusContainer)).trigger("change");

              }

              function searchEntered(e)
              {
                  var searchText = $('.lotusSelect-help input',$(lotusContainer)).val().toLowerCase();

                  if(searchText.length == 0)
                  {
                    $(".lotusSelect-list ul li").removeClass('lotusSelect-search-hide');
                    return;
                  }
                
                  $(".lotusSelect-list ul li" , $(lotusContainer)).each(function(){
                      if($(this).text().toLowerCase().indexOf(searchText) == -1)
                          $(this).addClass('lotusSelect-search-hide');
                      else
                          $(this).removeClass('lotusSelect-search-hide');
                  }); 
              }

              function clearSearchResults()
              {
                  $('.lotusSelect-help input',$(lotusContainer)).val("");
                  $(".lotusSelect-list ul li").removeClass('lotusSelect-search-hide');
              }



              this.init();
         }

         var selectInstance;
         if(typeof options === 'string')
         {
             var args = Array.prototype.slice.call(arguments,1);
             this.each(function(){
             	selectInstance = $.data(this,"_lotusselect");
             	if(!selectInstance)
             	{
                    console.error("The select instance is not yet initialized");
                    return;
             	}
             	else if(!$.isFunction(selectInstance[options]) || options.charAt(0) == '_')
             	{
             		console.warn("No function by that name exits in this object");
                return;
             	}
             	selectInstance[options].call(selectInstance,args);
             });
         }
         else
         {
         	this.each(function(){
                 selectInstance = $.data(this, "_lotusselect");
                 if(!selectInstance)
                 {
                    selectInstance = new lotusSelect(this,options);
                    $.data(this,"_lotusselect",selectInstance);
                 }
         	});
         }

	}

	/*!
	width - Sets the width of the lotus select plugin
		auto - Will auto resize based on the selected value
		inherit - Width will be inherited from the select.
	
	In any case the drop down will always haver the width of the select on which this is intialized.

	enableSearch - Will show a search bar when the drop down is opened.

	height - Sets the height of the lotus select plugin.default:23px
		inherit - Will inherit the select element height
		<value> - Custom height value 

	maxScrollshowItems - Restricts the amount of the items displayed in the drop down.

	padding - Will set the padding of the plugin. default is auto
		inherit - Will inherit the plugin from the select element.
		auto - Will add the lotus select padding 

	border - Add border to the plugin. default true.
	*/

	$.fn.lotusSelect.defaultOptions={
		"width":"auto",
		"enableSearch":true,
		"height":"23px",
		"maxScrollShowItems" : 10 ,
		"padding" :"auto",
		"border":true,
    "shadow" : true,
    "backgroundColor":"#ffffff"
	}

  $.fn.animateAuto = function(prop, speed, callback){
    var elem, height, width;
    return this.each(function(i, el){
      el = jQuery(el), elem = el.clone().css({"height":"auto","width":"auto"}).appendTo("body");
      height = elem.outerHeight(true);
      width = elem.outerWidth(true);
      elem.remove();

      if(prop === "height")
        el.animate({"height":height}, speed, callback);
      else if(prop === "width")
        el.animate({"width":width}, speed, callback);  
      else if(prop === "both")
        el.animate({"width":width,"height":height}, speed, callback);
    });  
  }
})(jQuery)
