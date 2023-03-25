// todo after fixing most stuff:
// format this script with vscode
// remove document ready function wrapper and just move the script to the bottom of index.html so it still waits for DOM

const VERSION = '1.2.8-Tavmod';
var converter = new showdown.Converter({ backslashEscapesHTMLTags: true,strikethrough: true,tables:true, underline:true,splitAdjacentBlockquotes:true});
var default_user_name = "You";
var curr_username = default_user_name;
var curr_charname = "Chloe";
var chat_mess_content = [{
    is_user: false,
    swipe_index: 0,
    swipe_array: ['*You went inside. The air smelled of fried meat, tobacco and a hint of wine. A dim light was cast by candles, and a fire crackled in the fireplace. It seems to be a very pleasant place. Behind the wooden bar is an elf waitress, she is smiling. Her ears are very pointy, and there is a twinkle in her eye. She wears glasses and a white apron. As soon as she noticed you, she immediately came right up close to you.*' +
        ' <p>Hello there! How is your evening going?</P>\n' +
        '<img src="img/tavern.png" width=50% style="opacity:1; display:block;border-radius:5px;margin-top:25px;margin-bottom:23px; margin-left: 45px;margin-right: auto;">\n<a id="verson" style="color:rgb(229, 224, 216,0.8);" href="https://github.com/TavernAI/TavernAI" target="_blank">TavernAI v' + VERSION + '</a><div id="characloud_url" style="margin-right:10px;margin-top:0px;float:right; height:25px;cursor: pointer;opacity: 0.99;display:inline-block;"><img src="img/cloud_logo.png" style="width: 25px;height: auto;display:inline-block; opacity:0.7;"><div style="vertical-align: top;display:inline-block;">Cloud</div></div><br><br><br><br>']
}];

var default_ch_mes = "Hello";
var curr_message_id = 0;
var generatedPromtCache = '';
var characters_array = [];
var active_character_index;
var backgrounds = [];
var default_avatar = 'img/fluffy.png';
var is_colab = false;
var is_checked_colab = false;
var menu_type = '';//basically used to kepe track of a  flag for if its a new character
var selected_button = '';//actually used as the flag

//might be able to rip these out
var create_save_name = '';
var create_save_description = '';
var create_save_personality = '';
var create_save_first_message = '';
var create_save_avatar = '';
var create_save_scenario = '';
var create_save_mes_example = '';

var timerSaveEdit; //flag for preventing redundant save calls
var durationSaveEdit = 2000; //TO for edit saves
var durationSaveContext = 2000; //TO for context saves
var connection_text_clear//flag for purging connected text
var save_text_clear //flag for preventing redundant save calls

//animation right menu
var animation_rm_duration = 200;
var animation_rm_easing = "";

var popup_type = "";
var bg_file_for_del = '';
var online_status = 'no_connection';
var is_send_press = false;//Send generation
var add_mes_without_animation = false;
var this_del_mes = 0;
var this_edit_mes_text = '';
var this_edit_mes_chname = '';
var this_edit_mes_id;

var main_api = 'kobold';
var settings;

//kobold settings
var kobold_API_key = "";
var koboldai_settings;
var koboldai_setting_names;
var preset_settings = 'gui';
var user_avatar = 'you1.png';
var temp_kobold = 0.5;
var kobold_amount_gen = 80;
var Kobold_max_context = 2048;//2048;
var rep_pen = 1;
var rep_pen_size = 100;

var is_pygmalion = false;
var tokens_already_generated = 0;
var message_already_generated = '';
var if_typing_text = false;
const tokens_cycle_count = 30;
var cycle_count_generation = 0;

var anchor_order = 0;
var style_anchor = true;
var character_anchor = true;

//cost vars
var prompt_price_per1k = 0.002 / 1000
var reply_price_per1k = 0.002 / 1000
var last_sent_cntn_tokens = 0;
var last_got_gen_tokens = 0;

//novel settings
var temp_novel = 0.5;
var rep_pen_novel = 1;
var rep_pen_size_novel = 100;

var api_key_novel = "";
var novel_tier;
var model_novel = "euterpe-v2";
var novelai_settings;
var novelai_setting_names;
var preset_settings_novel = 'Classic-Krake';

//openai settings
var temp_openai = 0.8;
var pres_pen_openai = 0.7;
var freq_pen_openai = 0.7;
var stream_openai = true;

var api_key_openai = "";
var openai_settings;
var openai_setting_names;
var preset_settings_openai = 'Default';

var openai_selected_gen = 300;
var openai_min_gen = 300;
var openai_max_gen = 3795;
//'reserve' 300 tokens for a reply
var openai_selected_context = 2048;
var scale_max_context = 7750;
var scale_max_gen = 400;

var openai_msgs = [];
var openai_msgs_example = [];

// scale settings
var api_key_scale = "";
var api_url_scale = "";
var scale_settings;
var scale_setting_names;
var preset_settings_scale = 'Default';

//last character chat
var last_char = ''
//system settings tab
var bg_shuffle_delay = 0
var open_last_char = true
var open_nav_bar = true
var open_bg_bar = true
var last_menu = ''

// extra tweaks
var keep_example_dialogue = true;
var nsfw_toggle = true;
var CYOA_mode = true;
//rip out
var enhance_definitions = false;
var agressive_parter = false;
var partner_mc = false;
var carry_me = false;
var user_actions = false;

//PROOMPTS
var system_prompt = ''
var description_prompt = ''
var personality_prompt = ''
var scenario_prompt = ''
var NSFW_on_prompt = ''
var NSFW_off_prompt = ''
var CYOA_prompt = ''
var custom_1_title = ''
var custom_2_title = ''
var custom_3_title = ''
var custom_4_title = ''
var custom_5_title = ''
var custom_1_desc = ''
var custom_2_desc = ''
var custom_3_desc = ''
var custom_4_desc = ''
var custom_5_desc = ''
var custom_1_prompt = ''
var custom_2_prompt = ''
var custom_3_prompt = ''
var custom_4_prompt = ''
var custom_5_prompt = ''
var custom_1_switch = false
var custom_2_switch = false
var custom_3_switch = false
var custom_4_switch = false
var custom_5_switch = false

//auto rety and continous mode
var auto_retry = false
var continuous_mode = false

//swipe stuff
var newest_mes_index = 0
var swipe_index = 0
var swipe_array = []

//css
var bg1_toggle = true;
var css_mes_bg = $('<div class="mes"></div>').css('background');
var css_send_form_display = $('<div id=send_form></div>').css('display');
var colab_ini_step = 1;
// feels good replacing 5+ places with a single function
function replacePlaceholders(text) {
    return text.replace(/{{user}}/gi, curr_username)
        .replace(/{{char}}/gi, curr_charname)
        .replace(/<USER>/gi, curr_username)
        .replace(/<BOT>/gi, curr_charname)
        .replace('\r\n\r\n', "\r\n")
        .replace('\n\n', "\n");
        
}

function parseExampleIntoIndividual(messageExampleString) {
    let result = []; // array of msgs
    let tmp = messageExampleString.split("\n");
    var cur_msg_lines = [];
    let in_user = false;
    let in_bot = false;
    function add_msg(name, role) {
        // join different newlines (we split them by \n and join by \n)
        // remove char name
        // strip to remove extra spaces
        let parsed_msg = cur_msg_lines.join("\n").replace(name + ":", "").trim();
        result.push({ "role": role, "content": parsed_msg });
        cur_msg_lines = [];
    }
    // skip first line as it'll always be "This is how {bot name} should talk"
    for (let i = 1; i < tmp.length; i++) {
        let cur_str = tmp[i];
        // if it's the user message, switch into user mode and out of bot mode
        // yes, repeated code, but I don't care
        if (cur_str.indexOf(curr_username + ":") === 0) {
            in_user = true;
            // we were in the bot mode previously, add the message
            if (in_bot) {
                add_msg(curr_charname, "assistant");
            }
            in_bot = false;
        } else if (cur_str.indexOf(curr_charname + ":") === 0) {
            in_bot = true;
            // we were in the user mode previously, add the message
            if (in_user) {
                add_msg(curr_username, "user");
            }
            in_user = false;
        }
        // push the current line into the current message array only after checking for presence of user/bot
        cur_msg_lines.push(cur_str);
    }
    // Special case for last message in a block because we don't have a new message to trigger the switch
    if (in_user) {
        add_msg(curr_username, "user");
    } else if (in_bot) {
        add_msg(curr_charname, "assistant");
    }
    return result;
}


var token;
$.ajaxPrefilter((options, originalOptions, xhr) => {
    xhr.setRequestHeader("X-CSRF-Token", token);
});

$.get("/csrf-token")
    .then(data => {
        token = data.token;
        getSettings("def");
        getLastVersion();
        getCharacters();
        printMessages();
        getBackgrounds();
        getUserAvatars();
    });

$('#characloud_url').click(function () {
    window.open('https://boosty.to/tavernai', '_blank');
});
function checkOnlineStatus() {
    console.trace("checkOnlineStatus",{
        main_api,
        online_status
    });
    //keep the spaces in the HTML
    //cheating on dynamic spacing
    if (online_status == 'no_connection') {
        $("#online_status_indicator").css("background-color", "red");
        $("#online_status_text").html("No connection... ");
        document.getElementById('online_status_text').classList.remove('connected')
        document.getElementById('online_status_text').classList.add('disconnected')
    } else {
        $("#online_status_text").html("connected! ");
        $("#online_status_indicator").css("background-color", "green");
        $("#online_status_text2").html(online_status);
        document.getElementById('online_status_text').classList.add('connected')
        document.getElementById('online_status_text').classList.remove('disconnected')
        clearTimeout(connection_text_clear)
        connection_text_clear = setTimeout(() => { $("#online_status_text").html(""); }, durationSaveEdit);
    }
}
async function getLastVersion() {
    jQuery.ajax({
        type: 'POST', // 
        url: '/getlastversion', // 
        data: JSON.stringify({
            '': ''
        }),
        beforeSend: function () {
        },
        cache: true,
        dataType: "json",
        contentType: "application/json",
        //processData: false, 
        success: function (data) {
            var getVersion = data.version;
            if (getVersion !== 'error' && getVersion != undefined) {
                if (compareVersions(getVersion, VERSION) === 1) {
                    $('#verson').append(' <span style="color: #326d78; font-size: 15px;">(New update @' + getVersion + ')</span>');
                }
            }
        },
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);
        }
    });

}
async function getStatus() {
    if (main_api == 'kobold') {
        console.log(`trying to connect to kobold`)
        jQuery.ajax({
            type: 'POST', // 
            url: '/getstatus', // 
            data: JSON.stringify({
                api_server: kobold_API_key
            }),
            cache: false,
            dataType: "json",
            crossDomain: true,
            contentType: "application/json",
            //processData: false, 
            success: function (data) {
				console.log("getStatus success", data)
                online_status = data.result;
                if (online_status == undefined) {
                    online_status = 'no_connection';
                }
                if (online_status.toLowerCase().indexOf('pygmalion') != -1) {
                    is_pygmalion = true;
                    online_status += " (Pyg. formatting on)";
                } else {
                    is_pygmalion = false;
                }
                //console.log(online_status);
                resultCheckStatus();
                if (online_status !== 'no_connection') {
                    var checkStatusNow = setTimeout(getStatus, 3000);//getStatus();
                }
            },
            error: function (jqXHR, exception) {
				console.log("getStatus error")
                console.log(exception);
                console.log(jqXHR);
                online_status = 'no_connection';
                resultCheckStatus();
            }
        });
    } else if (main_api == "novel") {
        console.log(`trying to connect to novel`)
        var data = { key: api_key_novel };
        jQuery.ajax({
            type: 'POST', // 
            url: '/getstatus_novelai', // 
            data: JSON.stringify(data),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
				console.log("getStatusNovel success");
                if (data.error != true) {
                    novel_tier = data.tier;
                    switch (novel_tier) {
                        case undefined:
                            online_status = 'no_connection';
                            break;
                        case 0:
                            online_status = "Paper";
                            break;
                        case 1:
                            online_status = "Tablet";
                            break;
                        case 2:
                            online_status = "Scroll";
                            break;
                        case 3:
                            online_status = "Opus";
                            break;
                    }
                }
                resultCheckStatus();
            },
            error: function (jqXHR, exception) {
				console.log("getStatusNovel error");
                online_status = 'no_connection';
                console.log(exception);
                console.log(jqXHR);
                resultCheckStatus();
            }
        });
    } else if (main_api == 'openai') {
        console.log(`trying to connect to OAI`)
        var data = { key: api_key_openai };
        jQuery.ajax({
            type: 'POST', // 
            url: '/getstatus_openai', // 
            data: JSON.stringify(data),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (!('error' in data)) online_status = 'Valid';
                resultCheckStatus();
            },
            error: function (jqXHR, exception) {
				console.log("getStatusOpen error");
                online_status = 'no_connection';
                console.log(exception);
                console.log(jqXHR);
                resultCheckStatus();
            }
        });
    } else if (main_api =='scale') {
        console.log(`trying to connect to scale`)
        var data = { key: api_key_scale, url: api_url_scale };
        jQuery.ajax({
            type: 'POST', // 
            url: '/getstatus_scale', // 
            data: JSON.stringify(data),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log("getstatus_scale success", data);
                if (!('error' in data)) online_status = 'Valid (see disclaimer below)';
                console.log("online_status", online_status);
                resultCheckStatus();
            },
            error: function (jqXHR, exception) {
                console.log("getstatus_scale error", jqXHR, exception);
                online_status = 'no_connection';
                console.log(exception);
                console.log(jqXHR);
                resultCheckStatus();
            }
        });
    } else {console.log(`unknown API`)}
}

function countTokens(messages, full = false) {
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    var token_count = -1;
    jQuery.ajax({
        async: false,
        type: 'POST', // 
        url: '/tokenize_openai', // 
        data: JSON.stringify(messages),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            token_count = data.token_count;
        }
    });
    if (!full) token_count -= 2;
    return token_count;
}

function resultCheckStatus() {
    checkOnlineStatus();
    $("#api_button").css("display", 'inline-block');
}

function printCharaters() {
    //console.log(1);
    $("#rm_print_charaters_block").empty();
    characters_array.forEach(function (item, i, arr) {
        var this_avatar = default_avatar;
        if (item.avatar != 'none') {
            this_avatar = "characters/" + item.avatar;
        }
        $("#rm_print_charaters_block").prepend('<div class=character_select chid=' + i + '><div class=avatar><img src="' + this_avatar + '"></div><div class=ch_name>' + item.name + '</div></div>');
        //console.log(item.name);
    });


}
async function getCharacters() {
    const response = await fetch("/getcharacters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token
        },
        body: JSON.stringify({
            "": ""
        })
    });
    if (response.ok === true) {
        const getData = await response.json();
        const load_ch_count = Object.getOwnPropertyNames(getData);
        for (var i = 0; i < load_ch_count.length; i++) {
            characters_array[i] = [];
            characters_array[i] = getData[i];
        }
        characters_array.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
        if (active_character_index != undefined) $("#avatar_url_pole").val(characters_array[active_character_index].avatar);
        printCharaters();
    }
}
async function getBackgrounds() {
    const response = await fetch("/getbackgrounds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
    });
    if (response.ok === true) {
      $("#generating_thumbs").addClass("generic_hidden");
      const getData = await response.json();
      const bgMenuContent = $("#bg_menu_content");
      for (var i = 0; i < getData.length; i++) {
        const bgExample = $("<div>").addClass("bg_example");
        const bgExampleImg = $("<img>").addClass("bg_example_img")
            .attr("bgfile", getData[i])
            .attr("src", "BG_thumbs/" + getData[i]);
        bgExample.append(bgExampleImg);
        bgMenuContent.append(bgExample);
      }
    }
  }
async function isColab() {
    is_checked_colab = true;
    const response = await fetch("/iscolab", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token
        },
        body: JSON.stringify({
            "": ""
        })
    });
    if (response.ok === true) {
        const getData = await response.json();
        if (getData.colaburl != false) {
            $('#shadow_popup.colab').addClass('generic_hidden')
            is_colab = true;
            let url = String(getData.colaburl).split("flare.com")[0] + "flare.com";
            url = String(url).split("loca.lt")[0] + "loca.lt";
            $('#api_url_text').val(url);
            setTimeout(function () {
                $('#api_button').click();
            }, 2000);
        }
    }
}
async function setBackground(bg) {
    jQuery.ajax({
        type: 'POST', // 
        url: '/setbackground', // 
        data: JSON.stringify({
            bg: bg
        }),
        cache: true,
        dataType: "json",
        contentType: "application/json",
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);
        }
    });
}
async function delBackground(bg) {
    const response = await fetch("/delbackground", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token
        },
        body: JSON.stringify({
            "bg": bg
        })
    });
}


//soft refresh chat messages
//for new format rules / new names
function soft_refresh() {
    //whatever it works ok
    if ($("#character_name_pole")[0].value != ''){
        curr_charname = $("#character_name_pole")[0].value
        $("#rm_button_selected_ch").children("h2").text(curr_charname);
    }

    let messages = document.getElementsByClassName('mes');
    console.log(messages);
    
    for (let i = 0; i < messages.length; i++) {
        let element = messages[i];
        var is_user = element.getAttribute('is_user');
        var swipe_counter = Number(element.getAttribute('swipe_index'));
        //console.log(is_user);
        
        // Hide swipe_left and swipe_right on all but last message with is_user=false, check if swipe index > 0 for left swipe
        let swipeLeft = element.querySelector('.swipe_left');
        let swipeRight = element.querySelector('.swipe_right');
        if (is_user=='false' && i !== messages.length - 1 || i  == 0) {
            //yes these if statements are needed, it throws a null reading error if its not here
            if (swipeLeft){
                swipeLeft.classList.add('generic_hidden')
            }
            if (swipeRight){
            swipeRight.classList.add('generic_hidden')
            }
    }else{
        if (swipeLeft && swipe_counter > 0){
            swipeLeft.classList.remove('generic_hidden')
        }
        if (swipeRight){
        swipeRight.classList.remove('generic_hidden')
        }
    }
    //display names
    if(is_user == 'true'){
        element.getElementsByClassName('displayname')[0].textContent = curr_username
    }
    else{
        element.getElementsByClassName('displayname')[0].textContent = curr_charname
    }
    }}
//add new messages
function printMessages() {
    //0 index
    newest_mes_index = chat_mess_content.length -1
    chat_mess_content.forEach(function (item, i, arr) {
        addOneMessage(item,chat_mess_content);
    }
    );
    soft_refresh()
}
function clearChat() {
    curr_message_id = 0;
    $('#chat').html('');
}

//used multiple times, streamlined for simplicity
//does replacements on a message when its displayed to user
//check is because OAI/scale formats their response properly and we dont need extra BR tags
//first (bot) message needs the force format flag or else it doesnt break its sentences up properly
function format_raw(payload,user_flag='',force_format=false){
    payload = payload.replace(/\n>| >|" >|'>/g, '\n> >').replace(/```/g, '\n```\n').replace(/(?=\<.+?\>)/g, '\\')
    payload = converter.makeHtml(payload);
    payload = payload.replace(/\n/g, '<br>')
    if (user_flag == curr_username || force_format){
    }
    //payload = payload.replace(/\n/g, '<br/>');
    return payload
}
//message modifications
function messageFormating(mes, ch_name,force_format = false) {
    //for Chloe
    if (active_character_index === undefined) {
        mes = mes.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br/>')
        //TD add option
    } else {
        mes = format_raw(mes,ch_name,force_format)
    }
    if (ch_name !== curr_username) {
        mes = mes.replaceAll(curr_charname + ":", "");
    }
    return mes;
}
//yes i am throwing this in a function
function clear_swipe(){
    swipe_array = []
    swipe_index = 0
}

function addOneMessage(mes) {
    clear_swipe()
    var messageText = mes['swipe_array'][swipe_index];
    var characterName = curr_username;
    generatedPromtCache = '';
    var avatarImg = "User Avatars/" + user_avatar;
    if (!mes['is_user']) {
        if (active_character_index == undefined) {
            avatarImg = "img/chloe.png";
        } else {
            if (characters_array[active_character_index].avatar != 'none') {
                avatarImg = "characters/" + characters_array[active_character_index].avatar;
            } else {
                avatarImg = "img/fluffy.png";
            }
        }
        characterName = curr_charname;
    }
    //bookmark
    if (curr_message_id == 0) {
        messageText = replacePlaceholders(messageText);
    }
    messageText = messageFormating(messageText, characterName,true);

    //ugly way to build a template
    var chatTemplate = `
        <div class='mes' mesid=${curr_message_id} ch_name=${characterName} is_user='${mes['is_user']}' swipe_index='${mes['swipe_index']}'>
            <div class='for_checkbox generic_hidden'></div>
            <input type='checkbox' class='del_checkbox generic_hidden'>
    `;
    chatTemplate += `<div class=avatar>
    <img src='${avatarImg}'>
    </div>
    <div class=mes_block>
    <div class=ch_name>
    <div class=displayname>${characterName}</div>
    <div title=Edit class=mes_edit>
    <img src='img/scroll.png' style='width:30px;height:30px;'>
    </div>
    <div class="mes_edit_cancel generic_hidden">
    <img src='img/cancel.png'>
    </div>
    <div class="mes_edit_done generic_hidden">
    <img src='img/done.png'>
            </div>
            </div>
            <div class=mes_text></div>
            `

        //genuis moment, swap the order here and throw it in reverse in the justify so its 'right aligned' by default
        //and stetches left for the left swipe
    if (!mes['is_user']) {
        chatTemplate += `<div class='swipe_block'>
        <div id='swipe_right' class="swipe_right generic_hidden">
        <img src="img/tri.png">
        </div>
        <div id='swipe_left' class="swipe_left generic_hidden">
            <img src="img/tri.png">
        </div>
        </div>`;
    }
    chatTemplate += `</div>`;
    
    $("#chat").append(chatTemplate);

    if (!if_typing_text) {
        $("#chat").children().filter('[mesid="' + curr_message_id + '"]').children('.mes_block').children('.mes_text').append(messageText);
    } else {
        typeWriter($("#chat").children().filter('[mesid="' + curr_message_id + '"]').children('.mes_block').children('.mes_text'), messageText, 50, 0);
    }
    curr_message_id++;
    if (!add_mes_without_animation) {
        $('#chat').children().last().transition({
            opacity: 1.0,
            duration: 700,
            easing: "",
            complete: function () { }
        });
    } else {
        add_mes_without_animation = false;
    }
    var $textchat = $('#chat');
    $textchat.scrollTop($textchat[0].scrollHeight);
}
function typeWriter(target, text, speed, i) {
    if (i < text.length) {
        target.html(target.html() + text.charAt(i));
        i++;
        setTimeout(() => typeWriter(target, text, speed, i), speed);
    }
}
$("#send_but").click(function () {
    if (is_send_press == false) {
        is_send_press = true;
        Generate();
    }
});


function build_main_system_message(r_flag=false){
    //console.log(`tried update sys prompt`)
    //global needs to be updated at this point
    //dont want to jump though updating it on char click right now
    if (active_character_index == undefined){
        if (r_flag){
            return ''
        }
        return
    }
    curr_charname = characters_array[active_character_index].name;
    let sys_prompt_compiler = `${replacePlaceholders(system_prompt)}\n`
    if (nsfw_toggle) {
        sys_prompt_compiler += `${replacePlaceholders(NSFW_on_prompt)}\n`;
    }
    else{
        sys_prompt_compiler += `${replacePlaceholders(NSFW_off_prompt)}\n`;
    }
    if (CYOA_mode) {
        sys_prompt_compiler += `${replacePlaceholders(CYOA_prompt)}\n`;
    }
    if (custom_1_switch) {
        sys_prompt_compiler += `${replacePlaceholders(custom_1_prompt)}\n`;
    }
    if (custom_2_switch) {
        sys_prompt_compiler += `${replacePlaceholders(custom_2_prompt)}\n`;
    }
    if (custom_3_switch) {
        sys_prompt_compiler += `${replacePlaceholders(custom_3_prompt)}\n`;
    }
    if (custom_4_switch) {
        sys_prompt_compiler += `${replacePlaceholders(custom_4_prompt)}\n`;
    }
    if (custom_5_switch) {
        sys_prompt_compiler += `${replacePlaceholders(custom_5_prompt)}\n`;
    }
    var charDescription = $.trim(characters_array[active_character_index].description);
    var charPersonality = $.trim(characters_array[active_character_index].personality);
    var Scenario = $.trim(characters_array[active_character_index].scenario);
    var built = ''
    if (charDescription !== undefined) {
        if (charDescription.length > 0) {
            charDescription = replacePlaceholders(charDescription);
        }
    }
    if (charPersonality !== undefined) {
        if (charPersonality.length > 0) {
            charPersonality = replacePlaceholders(charPersonality);
        }
    }
    if (Scenario !== undefined) {
        if (Scenario.length > 0) {
            Scenario = replacePlaceholders(Scenario);
        }
    }
    if (charDescription.length > 0) {
        built = replacePlaceholders(description_prompt) + charDescription + '\n';
    }
    if (charPersonality.length > 0) {
        built += replacePlaceholders(personality_prompt) + charPersonality+ '\n';
    }
    if (Scenario.length > 0) {
        built += replacePlaceholders(scenario_prompt) + Scenario+ '\n';
    }
    built = `${sys_prompt_compiler}${built}`
    document.getElementById('scenario_preview').value = built
    console.log(`${countTokens(sys_prompt_compiler)} tokens dedicated for SYS commands`)
    if(r_flag){
        return built
    }else
    {return}
}
function token_cost_converter(){
    document.getElementById('cost_preview').value = `Min $${(openai_selected_context*prompt_price_per1k)}
(${openai_selected_context} context tokens with 0 reply tokens)
Max $${((openai_selected_context*prompt_price_per1k)+((4096-openai_selected_context)*reply_price_per1k))}
(${openai_selected_context} context tokens with ${4096-openai_selected_context} reply tokens)`
}

async function Generate(type) {
    tokens_already_generated = 0;
    message_already_generated = curr_charname + ': ';
    if (online_status != 'no_connection' && active_character_index != undefined) {
        if (type != 'regenerate') {
            var textareaText = $("#send_textarea").val();
            $("#send_textarea").val('');
        } else {
            var textareaText = "";
            if (chat_mess_content[chat_mess_content.length - 1]['is_user']) {//If last message from You
            } else {
                chat_mess_content.length = chat_mess_content.length - 1;
                curr_message_id -= 1;
                $('#chat').children().last().remove();
                // We MUST remove the last message from the bot here as it's being regenerated.
                openai_msgs.pop();
            }
        }
        $("#send_but").addClass('generic_hidden');
        $("#loading_mes").removeClass('generic_hidden');
        var storyString = "";
        var postAnchorChar = "Elaborate speaker";//'Talk a lot with description what is going on around';// in asterisks
        var postAnchorStyle = "Writing style: very long messages";//"[Genre: roleplay chat][Tone: very long messages with descriptions]";
        var anchorTop = '';
        var anchorBottom = '';
        var topAnchorDepth = 8;
        if (character_anchor && !is_pygmalion) {
            if (anchor_order === 0) {
                anchorTop = `${curr_charname}: ${postAnchorChar}`;
            } else {
                anchorBottom = `[${curr_charname} ${postAnchorChar}]`
            }
        }
        if (style_anchor && !is_pygmalion) {
            if (anchor_order === 1) {
                anchorTop = postAnchorStyle;
            } else {
                anchorBottom = `[${postAnchorStyle}]`;
            }
        }
        //*********************************
        //PRE FORMATING STRING
        //*********************************
        if (textareaText != "") {
            chat_mess_content[chat_mess_content.length] = {};
            chat_mess_content[chat_mess_content.length - 1]['is_user'] = true;
            chat_mess_content[chat_mess_content.length - 1]['swipe_index'] =swipe_index;
            chat_mess_content[chat_mess_content.length - 1]['swipe_array'] =swipe_array;
            chat_mess_content[chat_mess_content.length - 1]['swipe_array'][swipe_index] = textareaText;
            addOneMessage(chat_mess_content[chat_mess_content.length - 1]);
        }
        var charPersonality = $.trim(characters_array[active_character_index].personality);
        var mesExamples = $.trim(characters_array[active_character_index].mes_example);
        var checkMesExample = $.trim(mesExamples.replace(/<START>/gi, ''));//for check length without tag
        if (checkMesExample.length == 0) mesExamples = '';
        var mesExamplesArray = [];
        //***Base replace***
        //bookmark 
        if (mesExamples !== undefined) {
            if (mesExamples.length > 0) {
                mesExamples = replacePlaceholders(mesExamples);
                //mesExamples = mesExamples.replaceAll('<START>', '[An example of how '+name2+' responds]');
                let blocks = mesExamples.split(/<START>/gi);
                mesExamplesArray = blocks.slice(1).map(block => `<START>\n${block.trim()}\n`);
            }
        }



        storyString = build_main_system_message(true)


        var j = 0;
        // clean openai msgs
        openai_msgs = [];
        for (var i = chat_mess_content.length - 1; i >= 0; i--) {
            // first greeting message
            if (j == 0) {
                chat_mess_content[j]['swipe_array'][swipe_index] = replacePlaceholders(chat_mess_content[j]['swipe_array'][swipe_index]);
            }
            let role = chat_mess_content[j]['is_user'] ? 'user' : 'assistant';
            openai_msgs[i] = { "role": role, "content": chat_mess_content[j]['swipe_array'][swipe_index] };
            j++;
        }

        let max_context_tokens = openai_selected_context;
		let max_gen_tokens = openai_selected_gen;

        // If we're using Scale, the user (presumably) is using GPT4 so we want
        // to be able to use a larger context. We're still using the GPT3
        // tokenization API so we can't go too close to the full 8192 limit.
        if (main_api == 'scale') {
            console.log(`Using Scale; increasing max context to ${scale_max_context} and max repsonse tokens to ${scale_max_gen}`);
            max_context_tokens = scale_max_context;
            max_gen_tokens = scale_max_gen;
        }

        var i = 0;

        // get a nice array of all blocks of all example messages = array of arrays (important!)
        openai_msgs_example = [];
        for (let k = 0; k < mesExamplesArray.length; k++) {
            let item = mesExamplesArray[k];
            // remove <START> {Example Dialogue:} and replace \r\n with just \n
            item = item.replace(/<START>/i, "{Example Dialogue:}").replace('\r\n', '\n');
            let parsed = parseExampleIntoIndividual(item);
            // add to the example message blocks array
            openai_msgs_example.push(parsed);
        }
        //dont know why this is an inline, too small brain to remove it
        runGenerate();
        function runGenerate(cycleGenerationPromt = '') {
            generatedPromtCache += cycleGenerationPromt;
            if (generatedPromtCache.length == 0) {
                openai_msgs = openai_msgs.reverse();
                var is_add_personality = false;
                openai_msgs.forEach(function (msg, i, arr) {//For added anchors and others
                    let item = msg["content"];
                    if (i === openai_msgs.length - topAnchorDepth && curr_message_id >= topAnchorDepth && !is_add_personality) {
                        is_add_personality = true;
                        if ((anchorTop != "" || charPersonality != "")) {
                            if (anchorTop != "") charPersonality += ' ';
                            // todo: change to something else?
                            item = `[${curr_charname} is ${charPersonality}${anchorTop}]\n${item}`;
                        }
                    }
                    if (i >= openai_msgs.length - 1 && curr_message_id > 8 && $.trim(item).substr(0, (curr_username + ":").length) == curr_username + ":") {//For add anchor in end
                        item = anchorBottom + "\n" + item;
                    }
                    msg["content"] = item;
                    openai_msgs[i] = msg;
                });
            }

            let prompt_msg = { "role": "system", "content": storyString }
            let examples_tosend = [];
            let openai_msgs_tosend = [];

            // todo: static value, maybe include in the initial context calculation
            let new_chat_msg = { "role": "system", "content": "[Start a new chat]" };
            let start_chat_count = countTokens([new_chat_msg]);
            let total_count = countTokens([prompt_msg], true) + start_chat_count;
            if (keep_example_dialogue) {
                for (let j = 0; j < openai_msgs_example.length; j++) {
                    let example_block = openai_msgs_example[j];
                    if (example_block.length != 0) {
                        examples_tosend.push(new_chat_msg);
                    }
                    for (let k = 0; k < example_block.length; k++) {
                        examples_tosend.push(example_block[k]);
                    }
                }
            }
            total_count += countTokens(examples_tosend);
            var dynamic_gen = 0
            //this WAS for scale but i remembered it doesnt take tavern gen settings
            //so its now a placeholder for a hook for what model to use
            if (main_api == 'openai'){
                dynamic_gen = 4096 - max_context_tokens
            }
            console.log(`dynamic gen amount assignment given ${dynamic_gen} tokens`)
            if (max_gen_tokens < dynamic_gen){
                dynamic_gen = max_gen_tokens
                console.log(`cap'd at ${dynamic_gen} tokens`)
            }
            for (let j = openai_msgs.length - 1; j >= 0; j--) {
                let item = openai_msgs[j];
                let item_count = countTokens(item);
                if ((total_count + item_count) >= (max_context_tokens)) {break;}
                if (j == openai_msgs.length - 1){item.content = item.content}
                openai_msgs_tosend.push(item);
                total_count += item_count;
            }
            if (!keep_example_dialogue){
                for (let j = 0; j < openai_msgs_example.length; j++) {
                    let example_block = openai_msgs_example[j];
                    for (let k = 0; k < example_block.length; k++) {
                        if (example_block.length == 0) { continue; }
                        let example_count = countTokens(example_block[k]);
                        if ((total_count + example_count + start_chat_count) >= (max_context_tokens)) {break;}
                        if (k == 0) {
                            examples_tosend.push(new_chat_msg);
                            total_count += start_chat_count;
                        }
                        examples_tosend.push(example_block[k]);
                        total_count += example_count;
                    }
                }
            }
            

            // reverse the messages array because we had the newest at the top to remove the oldest,
            // now we want proper order
            openai_msgs_tosend.reverse();
            openai_msgs_tosend = [prompt_msg, ...examples_tosend, new_chat_msg, ...openai_msgs_tosend]

            console.log("We're sending this:")
            console.log(openai_msgs_tosend);
            console.log(`${total_count} total context tokens`);

            var this_settings = openai_settings[openai_setting_names[preset_settings_openai]];
            var generate_data = {
                "messages": openai_msgs_tosend,
                // todo: add setting for le custom model
                "model": "gpt-3.5-turbo-0301",
                "temperature": parseFloat(temp_openai),
                "frequency_penalty": parseFloat(freq_pen_openai),
                "presence_penalty": parseFloat(pres_pen_openai),
                "max_tokens": dynamic_gen,
                "stream": stream_openai
            };

            var generate_url = '/generate_openai';
            var streaming = stream_openai;
			
			if (main_api == 'scale') {
                //console.log("Using scale spellbook backend instead of OpenAI");
                generate_url = '/generate_scale';
                streaming = false;
                generate_data = {
                    messages: openai_msgs_tosend,
                };
            }

            var last_view_mes = curr_message_id;
            jQuery.ajax({
                type: 'POST', // 
                url: generate_url, // 
                data: JSON.stringify(generate_data),
                cache: false,
                dataType: streaming ? "text" : "json",
                contentType: "application/json",
                xhrFields: {
                    onprogress: function (e) {
                        if (!streaming)
                            return;
                        var response = e.currentTarget.response;
                        if (response == "{\"error\":true}") {
                            is_send_press = false;
                            $("#send_but").removeClass('generic_hidden');
                            $("#loading_mes").addClass('generic_hidden');
                            return;
                        }

                        var eventList = response.split("\n");
                        var getMessage = "";
                        for (var event of eventList) {
                            if (!event.startsWith("data"))
                                continue;
                            if (event == "data: [DONE]") {
                                is_send_press = false;
                                chat[chat.length - 1]['swipe_array'][swipe_index] = getMessage;
                                $("#send_but").removeClass('generic_hidden');
                                $("#loading_mes").addClass('generic_hidden');
                                saveChat();
                                break;
                            }
                            var data = JSON.parse(event.substring(6));
                            // the first and last messages are undefined, protect against that
                            getMessage += data.choices[0]["delta"]["content"] || "";
                        }

                        if ($("#chat").children().filter('[mesid="' + last_view_mes + '"]').length == 0) {
                            chat[chat.length] = {};
                            chat[chat.length - 1]['is_user'] = false;
                            chat[chat.length - 1]['swipe_index'] = swipe_index;
                            chat[chat.length - 1]['swipe_array'] =swipe_array;
                            chat[chat.length - 1]['swipe_array'][swipe_index] = "";
                            addOneMessage(chat[chat.length - 1]);
                        }

                        getMessage = $.trim(getMessage);
                        var messageText = messageFormating(getMessage, curr_username);
                        $("#chat").children().filter('[mesid="' + last_view_mes + '"]').children('.mes_block').children('.mes_text').html(messageText);

                        var $textchat = $('#chat');
                        $textchat.scrollTop($textchat[0].scrollHeight);
                    }
                },
                success: function (data) {
                    if (streaming)
                        return;
                    try{
                        last_sent_cntn_tokens = data.usage.prompt_tokens
                        last_got_gen_tokens = data.usage.completion_tokens
                        update_real_cost()
                    }
                    catch{
                        update_real_cost(true)
                    }
                    is_send_press = false;
                    //$("#send_textarea").focus();
                    //$("#send_textarea").removeAttr('disabled');
                    if (data.error != true) {
                        //const getData = await response.json();
                        if (main_api == 'kobold') {
                            var getMessage = data.results[0].text;
                        }
                        if (main_api == 'novel') {
                            var getMessage = data.output;
                        }
                        if (main_api == 'openai') {
                            var getMessage = data.choices[0]["message"]["content"];
                        }
						if (main_api == 'scale') {
                            var getMessage = data.output;
                        }
						


                        //Formating
                        getMessage = $.trim(getMessage);
                        if (is_pygmalion) {
                            getMessage = getMessage.replace(new RegExp('<USER>', "g"), curr_username);
                            getMessage = getMessage.replace(new RegExp('<BOT>', "g"), curr_charname);
                            getMessage = getMessage.replace(new RegExp('You:', "g"), curr_username + ':');
                        }
                        if (getMessage.indexOf(curr_username + ":") != -1) {
                            getMessage = getMessage.substr(0, getMessage.indexOf(curr_username + ":"));

                        }
                        if (getMessage.indexOf('<|endoftext|>') != -1) {
                            getMessage = getMessage.substr(0, getMessage.indexOf('<|endoftext|>'));

                        }
                        if (getMessage.indexOf(curr_charname + ":") === 0) {
                            getMessage = getMessage.replace(curr_charname + ':', '');
                            getMessage = getMessage.trimStart();
                        }
                        //getMessage = getMessage.replace(/^\s+/g, '');
                        if (getMessage.length > 0) {
                            chat_mess_content[chat_mess_content.length] = {};
                            chat_mess_content[chat_mess_content.length - 1]['is_user'] = false;
                            chat_mess_content[chat_mess_content.length - 1]['swipe_index'] = swipe_index;
                            chat_mess_content[chat_mess_content.length - 1]['swipe_array'] =swipe_array;
                            getMessage = $.trim(getMessage);
                            chat_mess_content[chat_mess_content.length - 1]['swipe_array'][swipe_index] = getMessage;
                            //hook here for swipe right
                            addOneMessage(chat_mess_content[chat_mess_content.length - 1]);
                            $("#send_but").removeClass('generic_hidden');
                            $("#loading_mes").addClass('generic_hidden');
                            saveChat();
                        } else {
                            //console.log('run force_name2 protocol');
                            Generate('force_name2');
                        }
                    if (continuous_mode){
                        console.log("generated a new block in continuous")
                        $("#send_but").click()
                    }
                    } else {
                        $("#send_but").removeClass('generic_hidden');
                        $("#loading_mes").addClass('generic_hidden');
                        //janky hack to resend mesages in scale
                        if (auto_retry){
                            console.log("retry in auto")
                            $("#send_but").click()
                        }
                    }
                    soft_refresh()
                },
                error: function (jqXHR, exception) {
                    if (streaming) {
                        chat_mess_content.length = chat_mess_content.length - 1;
                        curr_message_id -= 1;
                        $('#chat').children().last().remove();
                    }
                    $("#send_textarea").removeAttr('disabled');
                    is_send_press = false;
                    $("#send_but").removeClass('generic_hidden');
                    $("#loading_mes").addClass('generic_hidden');
                    console.log(exception);
                    console.log(jqXHR);
                }
            });
        }
    } else {
        if (active_character_index == undefined) {
            //send ch sel
            popup_type = 'char_not_selected';
            callPopup('<h3>Сharacter is not selected</h3>');
        }
        is_send_press = false;
    }
}

async function saveChat() {
    chat_mess_content.forEach(function (item, i) {
        if (item['is_user']) {
            var str = item['swipe_array'][swipe_index].replace(curr_username + ':', default_user_name + ':');
            chat_mess_content[i]['swipe_array'][swipe_index] = str;
        }
    });
    //only exists as future support for custom log names
    var payload = [{last_open_date:Date.now() }, ...chat_mess_content];
    jQuery.ajax({
        type: 'POST',
        url: '/savechat',
        data: JSON.stringify({ file_name: characters_array[active_character_index].chat, chat: payload, avatar_url: characters_array[active_character_index].avatar }),
        cache: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
        },
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);
        }
    });
}
async function getChat() {
    jQuery.ajax({
        type: 'POST',
        url: '/getchat',
        data: JSON.stringify({ file_name: characters_array[active_character_index].chat, avatar_url: characters_array[active_character_index].avatar }),
        cache: false,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data[0] !== undefined) {
                for (let key in data) {
                    chat_mess_content.push(data[key]);
                }
                chat_mess_content.shift();
            }
            getChatResult();
            saveChat();
        },
        error: function (jqXHR, exception) {
            getChatResult();
            console.log(exception);
            console.log(jqXHR);
        }
    });
}

function getChatResult() {
    curr_charname = characters_array[active_character_index].name;
    if (chat_mess_content.length > 1) {

        chat_mess_content.forEach(function (item, i) {
            if (item['is_user']) {
                var str = item['swipe_array'][swipe_index].replace(default_user_name + ':', curr_charname + ':');
                str.replace(default_user_name + ':', curr_charname + ':');
                chat_mess_content[i]['swipe_array'][swipe_index] = str;
            }
        });
    } else {
        chat_mess_content[0] = {};
        chat_mess_content[0]['is_user'] = false;
        chat_mess_content[0]['swipe_index'] = swipe_index;
        chat_mess_content[0]['swipe_array'] = swipe_array;
        if (characters_array[active_character_index].first_mes != "") {
            chat_mess_content[0]['swipe_array'][swipe_index] = characters_array[active_character_index].first_mes;
        } else {
            chat_mess_content[0]['swipe_array'][swipe_index] = default_ch_mes;
        }
        }
        printMessages();
        select_selected_character(active_character_index);
    }
    $("#send_textarea").keypress(function (e) {
    if (e.which === 13 && !e.shiftKey && is_send_press == false) {
        is_send_press = true;
        e.preventDefault();
        Generate();
        //$(this).closest("form").submit();
    }
});

//menu buttons
var seleced_button_style = { color: "#bcc1c8" };
var deselected_button_style = { color: "#565d66" };
$("#rm_button_create").children("h2").addClass('selected_button')
$("#rm_button_characters").children("h2").addClass('selected_button')
$("#rm_button_settings").click(function () {
    selected_button = 'settings';
    menu_type = 'settings';
    $("#rm_charaters_block").addClass('generic_hidden');
    $("#rm_api_block").removeClass('generic_hidden');

    $("#rm_ch_create_block").addClass('generic_hidden');
    $("#rm_info_block").addClass('generic_hidden');

    $("#rm_button_characters").children("h2").removeClass('selected_button')
    $("#rm_button_settings").children("h2").addClass('selected_button')
    $("#rm_button_selected_ch").children("h2").removeClass('selected_button')
    //default selected option
    //$("#api_settings").children("h2").addClass('selected_button')
    build_main_system_message()
});
$("#rm_button_characters").click(function () {
        selected_button = 'characters';
        select_rm_characters();
});
$("#rm_button_back").click(function () {
        selected_button = 'characters';
        select_rm_characters();
});
$("#rm_button_create").click(function () {
        selected_button = 'create';
        select_rm_create();
});
$("#rm_button_selected_ch").click(function () {
        selected_button = 'character_edit';
        select_selected_character(active_character_index);
  });
function select_rm_create() {
    menu_type = 'create';
    if (selected_button == 'create') {
        if (create_save_avatar != '') {
            $("#add_avatar_button").get(0).files = create_save_avatar;
            read_avatar_load($("#add_avatar_button").get(0));
        }

    }
    $("#rm_charaters_block").addClass('generic_hidden');
    $("#rm_api_block").addClass('generic_hidden');
    $("#rm_ch_create_block").removeClass('generic_hidden');

    $('#rm_ch_create_block').transition({
        opacity: 1.0,
        duration: animation_rm_duration,
        easing: animation_rm_easing,
        complete: function () { }
    });
    $("#rm_info_block").addClass('generic_hidden');

    $("#delete_button_div").addClass('generic_hidden');
    $("#create_button").removeClass('generic_hidden');
    $("#create_button").attr("value", "Create");
    $('#result_info').html('&nbsp;');
    $("#rm_button_characters").children("h2").removeClass('selected_button')
    $("#rm_button_settings").children("h2").removeClass('selected_button')
    $("#rm_button_selected_ch").children("h2").removeClass('selected_button')

    //create text poles
    $("#rm_button_back").removeClass('generic_hidden')
    $("#character_import_button").removeClass('selected_button')
    $("#character_popup_text_h3").text('Create character');
    $("#character_name_pole").val(create_save_name);
    $("#description_textarea").val(create_save_description);
    $("#personality_textarea").val(create_save_personality);
    $("#firstmessage_textarea").val(create_save_first_message);
    $("#scenario_pole").val(create_save_scenario);
    if ($.trim(create_save_mes_example).length == 0) {
        $("#mes_example_textarea").val('<START>');
    } else {
        $("#mes_example_textarea").val(create_save_mes_example);
    }

    $("#avatar_load_preview").attr('src', default_avatar);
    $("#name_div").removeClass('generic_hidden');

    $("#form_create").attr("actiontype", "createcharacter");
}
function select_rm_characters() {
    //$("#rm_button_characters").children("h2").classList.add('de_selected_button');
    //$("#rm_button_settings").children("h2").classList.add('selected_button');
    //$("#rm_button_selected_ch").children("h2").classList.add('de_selected_button');


    menu_type = 'characters';
    $("#rm_charaters_block").removeClass('generic_hidden');
    //$('#rm_charaters_block').css('opacity', 0.0);
    $('#rm_charaters_block').transition({
        opacity: 1.0,
        duration: animation_rm_duration,
        easing: animation_rm_easing,
        complete: function () { }
    });

    $("#rm_api_block").addClass('generic_hidden');
    $("#rm_ch_create_block").addClass('generic_hidden');
    $("#rm_info_block").addClass('generic_hidden');

    $("#rm_button_characters").children("h2").addClass('selected_button')
    $("#rm_button_settings").children("h2").removeClass('selected_button')
    $("#rm_button_selected_ch").children("h2").removeClass('selected_button')
}
function select_rm_info(text) {
    $("#rm_charaters_block").addClass('generic_hidden');
    $("#rm_api_block").addClass('generic_hidden');
    $("#rm_ch_create_block").addClass('generic_hidden');
    $("#rm_info_block").css("display", "flex");

    $("#rm_info_text").html('<h3>' + text + '</h3>');

    $("#rm_button_characters").children("h2").removeClass('selected_button')
    $("#rm_button_settings").children("h2").removeClass('selected_button')
    $("#rm_button_selected_ch").children("h2").removeClass('selected_button')
}

function select_selected_character(chid) { //character select

    select_rm_create();
    menu_type = 'character_edit';
    $("#delete_button_div").removeClass('generic_hidden');
    $("#rm_button_selected_ch").children("h2").addClass('selected_button')
    var display_name = characters_array[chid].name;

    $("#rm_button_selected_ch").children("h2").text(display_name);

    //create text poles
    $("#rm_button_back").addClass('generic_hidden');
    //$("#character_import_button").addClass('generic_hidden');
    $("#create_button").attr("value", "Save");
    $("#create_button").addClass('generic_hidden');
   /* var i = 0;
    while ($("#rm_button_selected_ch").width() > 170 && i < 15) {
        display_name = display_name.slice(0, display_name.length - 2);
        //console.log(display_name);
        $("#rm_button_selected_ch").children("h2").text($.trim(display_name) + '...');
        i++;
    }*/
    $("#add_avatar_button").val('');

    $('#character_popup_text_h3').text(characters_array[chid].name);
    $("#character_name_pole").val(characters_array[chid].name);
    $("#description_textarea").val(characters_array[chid].description);
    $("#personality_textarea").val(characters_array[chid].personality);
    $("#firstmessage_textarea").val(characters_array[chid].first_mes);
    $("#scenario_pole").val(characters_array[chid].scenario);
    $("#mes_example_textarea").val(characters_array[chid].mes_example);
    $("#selected_chat_pole").val(characters_array[chid].chat);
    //console.log(`create date ` + characters[chid].create_date + `number conv`+ Number(characters[chid].create_date))
    //check for 'bad' cards
    if (characters_array[chid].create_date == undefined || Number(characters_array[chid].create_date) == 'NaN' || Number(characters_array[chid].create_date) == NaN||Number(characters_array[chid].create_date) === 0){
        //update creation date and push the save button
        $("#create_date_pole").val(Date.now())
        setTimeout(() => { $("#create_button").click(); }, durationSaveEdit);
    }
    else{
        $("#create_date_pole").val(characters_array[chid].create_date)
    }
    $("#avatar_url_pole").val(characters_array[chid].avatar);
    $("#chat_import_avatar_url").val(characters_array[chid].avatar);
    $("#chat_import_character_name").val(characters_array[chid].name);
    //$("#avatar_div").addClass('generic_hidden');
    var this_avatar = default_avatar;
    if (characters_array[chid].avatar != 'none') {
        this_avatar = "characters/" + characters_array[chid].avatar;
    }
    $("#avatar_load_preview").attr('src', this_avatar);
    $("#name_div").removeClass('generic_hidden');

    $("#form_create").attr("actiontype", "editcharacter");
}
$(document).on('click', '.character_select', function () {
    if (active_character_index !== $(this).attr("chid")) {
        if (!is_send_press) {
            //bookmark, character select
            const char_avatar = this.querySelector('div.avatar').querySelector("img").getAttribute('src');
            //console.log(char_avatar)
            last_char = char_avatar.replace(/#.*/, "")
            //console.log(last_char)
            saveSettings();
            this_edit_mes_id = undefined;
            selected_button = 'character_edit';
            active_character_index = $(this).attr("chid");
            clearChat();
            chat_mess_content.length = 0;
            getChat();
        }
    } else {
        selected_button = 'character_edit';
        select_selected_character(active_character_index);
    }

});
var scroll_holder = 0;
var is_use_scroll_holder = false;
$(document).on('input', '.edit_textarea', function () {
    scroll_holder = $("#chat").scrollTop();
    $(this).height(0).height(this.scrollHeight);
    is_use_scroll_holder = true;
});
$("#chat").on("scroll", function () {
    if (is_use_scroll_holder) {
        $("#chat").scrollTop(scroll_holder);
        is_use_scroll_holder = false;
    }

});
$(document).on('click', '.del_checkbox', function () {
    $('.del_checkbox').each(function () {
        $(this).prop("checked", false);
        $(this).parent().css('background', css_mes_bg);
    });
    $(this).parent().css('background', "#791b31");
    var i = $(this).parent().attr('mesid');
    this_del_mes = i;
    while (i < chat_mess_content.length) {
        $(".mes[mesid='" + i + "']").css('background', "#791b31");
        $(".mes[mesid='" + i + "']").children('.del_checkbox').prop("checked", true);
        i++;
        //console.log(i);
    }

});
$(document).on('click', '#user_avatar_block .avatar', function () {
    user_avatar = $(this).attr("imgfile");
    $('.mes').each(function () {
        if ($(this).attr('ch_name') == curr_username) {
            $(this).children('.avatar').children('img').attr('src', 'User Avatars/' + user_avatar);
        }
    });
    saveSettings();

});
$("#logo_block").click(function () {
    let Bg_menu = document.getElementById('bg_menu')
    let is_hidden = Bg_menu.classList.contains('active');
    let main_chat = document.getElementById('main_chat')
    if (is_hidden == false) {
        Bg_menu.classList.add('active');
        main_chat.classList.add('left_open');
    } else {
        Bg_menu.classList.remove('active');
        main_chat.classList.remove('left_open');
        };
    }
);


$(document).on('click', '.bg_example_img', function () {
    var this_bgfile = $(this).attr("bgfile");
    if (bg1_toggle == true) {
        bg1_toggle = false;
        var number_bg = 2;
        var target_opacity = 1.0;
    } else {
        bg1_toggle = true;
        var number_bg = 1;
        var target_opacity = 0.0;
    }
    $('#bg2').stop();
    $('#bg2').transition({
        opacity: target_opacity,
        duration: 1300,//animation_rm_duration,
        easing: "linear",
    });
    $('#bg' + number_bg).css('background-image', 'url("backgrounds/' + this_bgfile + '")');
    setBackground(this_bgfile);
});

$("#dialogue_popup_ok").click(function () {
    $("#shadow_popup").addClass('generic_hidden')
    if (popup_type == 'del_bg') {
        delBackground(bg_file_for_del.attr("bgfile"));
        bg_file_for_del.parent().remove();
    }
    if (popup_type == 'del_ch') {
        var msg = jQuery('#form_create').serialize(); // ID form
        jQuery.ajax({
            method: 'POST',
            url: '/deletecharacter',
            beforeSend: function () {
                select_rm_info("Character deleted");
            },
            data: msg,
            cache: false,
            success: function (html) {
                location.reload();
                //getCharacters();
            }
        });
    }
    if (popup_type == 'new_chat' && active_character_index != undefined && menu_type != "create") {//Fix it; New chat doesn't create while open create character menu
        clearChat();
        chat_mess_content.length = 0;
        characters_array[active_character_index]['chat'] = Date.now();
        $("#selected_chat_pole").val(characters_array[active_character_index].chat);
        common_click_save()
        getChat();

    }
});
$("#dialogue_popup_cancel").click(function () {
    $("#shadow_popup").addClass('generic_hidden')
    $("#shadow_popup").css('opacity:', 0.0);
    popup_type = '';
});
function callPopup(text) {
    $("#dialogue_popup_cancel").removeClass('generic_hidden')
    $("#shadow_popup").removeClass('generic_hidden')
    switch (popup_type) {

        case 'char_not_selected':
            $("#dialogue_popup_ok").css("background-color", "#191b31CC");
            $("#dialogue_popup_ok").text("Ok");
            $("#dialogue_popup_cancel").addClass('generic_hidden');
            break;

        case 'new_chat':

            $("#dialogue_popup_ok").css("background-color", "#191b31CC");
            $("#dialogue_popup_ok").text("Yes");
            break;
        default:
            $("#dialogue_popup_ok").css("background-color", "#791b31");
            $("#dialogue_popup_ok").text("Delete");

    }
    $("#dialogue_popup_text").html(text);
    $("#shadow_popup").removeClass('generic_hidden')
    $('#shadow_popup').transition({ opacity: 1.0, duration: animation_rm_duration, easing: animation_rm_easing });
}

function read_bg_load(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#bg_load_preview')
                .attr('src', e.target.result)
                .width(103)
                .height(83);
            var formData = new FormData($("#form_bg_download").get(0));
            //console.log(formData);
            jQuery.ajax({
                type: 'POST',
                url: '/downloadbackground',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (html) {
                    setBackground(html);
                    if (bg1_toggle == true) {
                        bg1_toggle = false;
                        var number_bg = 2;
                        var target_opacity = 1.0;
                    } else {
                        bg1_toggle = true;
                        var number_bg = 1;
                        var target_opacity = 0.0;
                    }
                    $('#bg2').transition({
                        opacity: target_opacity,
                        duration: 1300,//animation_rm_duration,
                        easing: "linear",
                    });
                    $('#bg' + number_bg).css('background-image', 'url(' + e.target.result + ')');
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    console.log(jqXHR);
                }
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}
$("#add_bg_button").change(function () {
    read_bg_load(this);

});
function read_avatar_load(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        if (selected_button == 'create') {
            create_save_avatar = input.files;
        }
        reader.onload = function (e) {
            if (selected_button == 'character_edit') {
                //bypass save delay
                $("#create_button").click()
            }
            $('#avatar_load_preview')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
$("#add_avatar_button").change(function () {
    read_avatar_load(this);
});
$("#form_create").submit(function(type) {
    $('#rm_info_avatar').html('');
    var formData = new FormData($("#form_create").get(0));
    if ($("#form_create").attr("actiontype") == "createcharacter") {
        if ($("#character_name_pole").val().length > 0) {
            jQuery.ajax({
                type: 'POST',
                url: '/createcharacter',
                data: formData,
                beforeSend: function () {
                    $('#create_button').attr('disabled', true);
                    $('#create_button').attr('value', 'Creating...');
                },
                cache: false,
                contentType: false,
                processData: false,
                success: function (html) {
                    $('#character_cross').click();
                    $("#character_name_pole").val('');
                    create_save_name = '';
                    $("#description_textarea").val('');
                    create_save_description = '';
                    $("#personality_textarea").val('');
                    create_save_personality = '';
                    $("#firstmessage_textarea").val('');
                    create_save_first_message = '';
                    $("#character_popup_text_h3").text('Create character');
                    $("#scenario_pole").val('');
                    create_save_scenario = '';
                    $("#mes_example_textarea").val('');
                    create_save_mes_example = '';
                    create_save_avatar = '';
                    $('#create_button').removeAttr("disabled");
                    $("#add_avatar_button").replaceWith($("#add_avatar_button").val('').clone(true));
                    $('#create_button').attr('value', 'Create');
                    if (true) {
                        $('#rm_info_block').transition({ opacity: 0, duration: 0 });
                        var $prev_img = $('#avatar_div_div').clone();
                        $('#rm_info_avatar').append($prev_img);
                        select_rm_info("Character created");
                        $('#rm_info_block').transition({ opacity: 1.0, duration: 2000 });
                        getCharacters();
                    } else {
                        $('#result_info').html(html);
                    }
                },
                error: function (jqXHR, exception) {
                    $('#create_button').removeAttr("disabled");
                }
            });
        } else {
            $('#result_info').html("Name not entered");
        }
    } else {
        jQuery.ajax({
            type: 'POST',
            url: '/editcharacter',
            data: formData,
            beforeSend: function () {
                $('#create_button').attr('disabled', true);
                $('#create_button').attr('value', 'Save');
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function (html) {
                if (chat_mess_content.length === 1) {
                    var this_ch_mes = default_ch_mes;
                    if ($('#firstmessage_textarea').val() != "") {
                        this_ch_mes = $('#firstmessage_textarea').val();
                    }
                    if (this_ch_mes != $.trim($("#chat").children('.mes').children('.mes_block').children('.mes_text').text())) {
                        clearChat();
                        chat_mess_content.length = 0;
                        chat_mess_content[0] = {};
                        chat_mess_content[0]['is_user'] = false;
                        chat_mess_content[0]['swipe_array']=swipe_array;
                        chat_mess_content[0]['swipe_array'][swipe_index] = this_ch_mes;
                        add_mes_without_animation = true;
                        addOneMessage(chat_mess_content[0]);
                        soft_refresh()
                    }
                }
                $('#create_button').removeAttr("disabled");
                getCharacters();
                $("#add_avatar_button").replaceWith($("#add_avatar_button").val('').clone(true));
                $('#create_button').attr('value', 'Save');
                function getTokensForPart(text) {
                    let msg = {"role": "system", content: text.replace("\r\n", "\n")};
                    let result = countTokens(msg) - 4 - 1;
                    return result;
                }
                let desc_tokens = getTokensForPart(characters_array[active_character_index].description);
                let pers_tokens = getTokensForPart(characters_array[active_character_index].personality);
                let scen_tokens = getTokensForPart(characters_array[active_character_index].scenario);
                
                // ugly but that's what we have, have to replicate the normal example message parsing code
                let blocks = replacePlaceholders(characters_array[active_character_index].mes_example).split(/<START>/gi);
                let example_msgs_array = blocks.slice(1).map(block => `<START>\n${block.trim()}\n`);
                let exmp_tokens = 0;
                let block_count = 0;
                let msg_count = 0;
                for (var block of example_msgs_array) {
                    block_count++;
                    let example_blocks = parseExampleIntoIndividual(block);
                    for (var block of example_blocks) {
                        exmp_tokens += countTokens(block);
                        msg_count ++;
                    }
                }
                let count_tokens = desc_tokens + pers_tokens + scen_tokens + exmp_tokens;
                let res_str = `Total: ${count_tokens} tokens.\nDescription: ${desc_tokens}\nPersonality: ${pers_tokens}\nScenario: ${scen_tokens}\n`+
                `Found ${block_count} example message blocks\n${msg_count} messages totaling ${exmp_tokens} tokens`;
                if (count_tokens < 1024) {
                    $('#result_info').html(res_str);
                } else {
                    $('#result_info').html("<font color=red>" + res_str + " Tokens (Too many tokens, consider reducing character definition)</font>");
                }
                lower_save_flag()
            },
            error: function (jqXHR, exception) {
                $('#create_button').removeAttr("disabled");
                $('#result_info').html("<font color=red>Error: no connection</font>");
            }
        });
    }

});
$("#delete_button").click(function () {
    popup_type = 'del_ch';
    callPopup('<h3>Delete the character?</h3>');
});
$("#rm_info_button").click(function () {
    $('#rm_info_avatar').html('');
    select_rm_characters();
});

function common_click_save() {
    raise_save_flag()
    clearTimeout(timerSaveEdit);
    timerSaveEdit = setTimeout(() => { 
        $("#create_button").click(),
        build_main_system_message() }, durationSaveEdit);
}
//@@@@@@@@@@@@@@@@@@@@@@@@
//character text poles creating and editing save
$('#character_name_pole').on('change keyup paste', function () {
    if (menu_type == 'create') {
        create_save_name = $('#character_name_pole').val();
    }
    else {
        raise_save_flag()
        clearTimeout(timerSaveEdit);
        timerSaveEdit = setTimeout(() => { $("#create_button").click();
        curr_charname = $("#character_name_pole")[0].value
        build_main_system_message()
        soft_refresh(); }
        , durationSaveEdit);
    }
});
//saveflag
function raise_save_flag(){
    document.getElementById("save_indicator").innerHTML = "warning unsaved changes!"
    document.getElementById('save_indicator').classList.add('warning')
    document.getElementById('save_indicator').classList.remove('saved')
}
function lower_save_flag(){
        document.getElementById("save_indicator").innerHTML = "saved!"
        document.getElementById('save_indicator').classList.remove('warning')
        document.getElementById('save_indicator').classList.add('saved')
    clearTimeout(save_text_clear);
    save_text_clear = setTimeout(() => {document.getElementById("save_indicator").innerHTML = "" }, durationSaveEdit);
}
$('#description_textarea').on('keyup paste cut', function () {//change keyup paste cut
    if (menu_type == 'create') {
        create_save_description = $('#description_textarea').val();
    } else {
        common_click_save()
        prompt_flag_save()
    }

});
$('#personality_textarea').on('keyup paste cut', function () {
    if (menu_type == 'create') {
        create_save_personality = $('#personality_textarea').val();
    } else {
        common_click_save()
    }
});
$('#scenario_pole').on('keyup paste cut', function () {
    if (menu_type == 'create') {
        create_save_scenario = $('#scenario_pole').val();
    } else {
        common_click_save()
    }
});
$('#mes_example_textarea').on('keyup paste cut', function () {
    if (menu_type == 'create') {
        create_save_mes_example = $('#mes_example_textarea').val();
    } else {
        common_click_save()
    }
});
$('#firstmessage_textarea').on('keyup paste cut', function () {
    if (menu_type == 'create') {
        create_save_first_message = $('#firstmessage_textarea').val();
    } else {
        common_click_save()
    }
});
document.querySelectorAll('.api_button').forEach((element) => {
    element.addEventListener('click', try_connect);
});
function try_connect(){
console.log(`clicked`)
if (main_api == 'kobold'){
    $("#api_button").css("display", 'none');
    kobold_API_key = $('#api_url_text').val();
    kobold_API_key = $.trim(kobold_API_key);
    if (kobold_API_key.substr(kobold_API_key.length - 1, 1) == "/") {
        kobold_API_key = kobold_API_key.substr(0, kobold_API_key.length - 1);
    }
    if (!(kobold_API_key.substr(kobold_API_key.length - 3, 3) == "api" || kobold_API_key.substr(kobold_API_key.length - 4, 4) == "api/")) {
        kobold_API_key = kobold_API_key + "/api";
    }
    }else if (main_api == 'novel'){
        api_key_novel = $('#api_key_novel').val();
        api_key_novel = $.trim(api_key_novel);
    }else if (main_api == "openai"){
        api_key_openai = $('#api_key_openai').val();
        api_key_openai = $.trim(api_key_openai);
    }else if (main_api == 'scale'){
        api_key_scale = $('#api_key_scale').val();
        api_key_scale = $.trim(api_key_scale);
        api_url_scale = $('#api_url_scale').val();
        api_url_scale = $.trim(api_url_scale);
}
saveSettings();
getStatus();
}

//bookmark
let options_butt = document.getElementById('options-content')
let optins_open = false
$("#options_button").click(function () {

    if (!optins_open) {
        options_butt.classList.add('active');
    }
    else{
        options_butt.classList.remove('active');
    }
    optins_open = !optins_open
        });
;
$("#option_select_chat").click(function () {
    if (active_character_index != undefined && !is_send_press) {
        getAllCharaChats();
        $('#shadow_select_chat_popup').removeClass('generic_hidden')
    }
});
$("#option_start_new_chat").click(function () {
    if (active_character_index != undefined && !is_send_press) {
        popup_type = 'new_chat';
        callPopup('<h3>Start new chat?</h3>');
    }
});
$("#option_regenerate").click(function () {
    if (is_send_press == false) {
        is_send_press = true;
        Generate('regenerate');
    }
});
//what the fuck is this
$("#option_delete_mes").click(function () {
    if (active_character_index != undefined && !is_send_press) {
        $('#dialogue_del_mes').removeClass('generic_hidden')
        $('#send_form').addClass('generic_hidden')
        $('.del_checkbox').each(function () {
            if ($(this).parent().attr('mesid') != 0) {
                $(this).removeClass('generic_hidden');
                $(this).parent().children('.for_checkbox').addClass('generic_hidden')
            }
        });
    }
});
$("#dialogue_del_mes_cancel").click(function () {
    $('#dialogue_del_mes').addClass('generic_hidden')
    $("#send_form").removeClass('generic_hidden');
    $('.del_checkbox').each(function () {
        $(this).addClass('generic_hidden');
        $(this).parent().children('.for_checkbox').removeClass('generic_hidden')
        $(this).parent().css('background', css_mes_bg);
        $(this).prop("checked", false);

    });
    this_del_mes = 0;

});
$("#dialogue_del_mes_ok").click(function () {
    $('#dialogue_del_mes').addClass('generic_hidden')
    $("#send_form").removeClass('generic_hidden');
    $('.del_checkbox').each(function () {
        $(this).addClass('generic_hidden');
        $(this).parent().children('.for_checkbox').removeClass('generic_hidden')
        $(this).parent().css('background', css_mes_bg);
        $(this).prop("checked", false);
        soft_refresh()

    });
    if (this_del_mes != 0) {
        $(".mes[mesid='" + this_del_mes + "']").nextAll('div').remove();
        $(".mes[mesid='" + this_del_mes + "']").remove();
        chat_mess_content.length = this_del_mes;
        curr_message_id = this_del_mes;
        saveChat();
        var $textchat = $('#chat');
        $textchat.scrollTop($textchat[0].scrollHeight);
    }
    this_del_mes = 0;


});

$("#settings_perset").change(function () {

    if ($('#settings_perset').find(":selected").val() != 'gui') {
        preset_settings = $('#settings_perset').find(":selected").text();
        temp_kobold = koboldai_settings[koboldai_setting_names[preset_settings]].temp;
        kobold_amount_gen = koboldai_settings[koboldai_setting_names[preset_settings]].genamt;
        rep_pen = koboldai_settings[koboldai_setting_names[preset_settings]].rep_pen;
        rep_pen_size = koboldai_settings[koboldai_setting_names[preset_settings]].rep_pen_range;
        Kobold_max_context = koboldai_settings[koboldai_setting_names[preset_settings]].max_length;
        $('#temp').val(temp_kobold);
        $('#temp_counter').html(temp_kobold);

        $('#amount_gen').val(kobold_amount_gen);
        $('#amount_gen_counter').html(kobold_amount_gen);

        $('#max_context').val(Kobold_max_context);
        $('#max_context_counter').html(Kobold_max_context + " Tokens");

        $('#OAI_context_input').val(openai_selected_context);
        $('#OAI_context_slider').val(openai_selected_context);
        $('#OAI_context_display').html(openai_selected_context + " Tokens");
        $('#OAI_gen_input').val(openai_selected_gen);
        $('#OAI_gen_slider').val(openai_selected_gen);
        $('#OAI_gen_display').html(openai_selected_gen + " Tokens");
        token_cost_converter()
		
		$('#scale_max_context').val(scale_max_context);
        $('#scale_max_context_counter').html(scale_max_context + " Tokens");

        $('#scale_max_gen').val(scale_max_gen);
        $('#scale_max_tokens_counter').html(scale_max_gen + " Tokens");

        $('#rep_pen').val(rep_pen);
        $('#rep_pen_counter').html(rep_pen);

        $('#rep_pen_size').val(rep_pen_size);
        $('#rep_pen_size_counter').html(rep_pen_size + " Tokens");

        $("#range_block").children().prop("disabled", false);
        $("#range_block").css('opacity', 1.0);
        $("#amount_gen_block").children().prop("disabled", false);
        $("#amount_gen_block").css('opacity', 1.0);

    } else {
        //$('.button').disableSelection();
        preset_settings = 'gui';
        $("#range_block").children().prop("disabled", true);
        $("#range_block").css('opacity', 0.5);
        $("#amount_gen_block").children().prop("disabled", true);
        $("#amount_gen_block").css('opacity', 0.45);
    }
    saveSettings();
});
$("#settings_perset_novel").change(function () {

    preset_settings_novel = $('#settings_perset_novel').find(":selected").text();
    temp_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].temperature;
    //amount_gen = koboldai_settings[koboldai_setting_names[preset_settings]].genamt;
    rep_pen_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].repetition_penalty;
    rep_pen_size_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].repetition_penalty_range;
    $('#temp_novel').val(temp_novel);
    $('#temp_counter_novel').html(temp_novel);

    //$('#amount_gen').val(amount_gen);
    //$('#amount_gen_counter').html(amount_gen);

    $('#rep_pen_novel').val(rep_pen_novel);
    $('#rep_pen_counter_novel').html(rep_pen_novel);

    $('#rep_pen_size_novel').val(rep_pen_size_novel);
    $('#rep_pen_size_counter_novel').html(rep_pen_size_novel + " Tokens");

    //$("#range_block").children().prop("disabled", false);
    //$("#range_block").css('opacity',1.0);
    saveSettings();
});
$("#settings_perset_openai").change(function () {
    preset_settings_openai = $('#settings_perset_openai').find(":selected").text();

    temp_openai = openai_settings[openai_setting_names[preset_settings_openai]].temperature;
    freq_pen_openai = openai_settings[openai_setting_names[preset_settings_openai]].frequency_penalty;
    pres_pen_openai = openai_settings[openai_setting_names[preset_settings_openai]].presence_penalty;scale_settings

    $('#temp_openai').val(temp_openai);
    $('#temp_counter_openai').html(temp_openai);
    $('#freq_pen_openai').val(freq_pen_openai);
    $('#freq_pen_counter_openai').html(freq_pen_openai);
    $('#pres_pen_openai').val(pres_pen_openai);
    $('#pres_pen_counter_openai').html(pres_pen_openai);

    saveSettings();
});
$("#settings_perset_scale").change(function () {
    preset_settings_scale = $('#settings_perset_scale').find(":selected").text();

    temp_scale = scale_settings[scale_setting_names[preset_settings_scale]].temperature;
    freq_pen_scale = scale_settings[scale_setting_names[preset_settings_scale]].frequency_penalty;
    pres_pen_scale = scale_settings[scale_setting_names[preset_settings_scale]].presence_penalty;

    $('#temp_scale').val(temp_scale);
    $('#temp_counter_scale').html(temp_scale);
    $('#freq_pen_scale').val(freq_pen_scale);
    $('#freq_pen_counter_scale').html(freq_pen_scale);
    $('#pres_pen_scale').val(pres_pen_scale);
    $('#pres_pen_counter_scale').html(pres_pen_scale);

    saveSettings();
});
$("#main_api").change(function () {
    changeMainAPI();
	console.log("main api changed");
    is_pygmalion = false;
    online_status = 'no_connection';
    checkOnlineStatus();
    saveSettings();
});
function changeMainAPI() {
    const selectedApi = $('#main_api').find(":selected").val();
    $('#kobold_api').css("display", selectedApi == 'kobold' ? "block" : "none");
    $('#novel_api').css("display", selectedApi == 'novel' ? "block" : "none");
    $('#openai_api').css("display", selectedApi == 'openai' ? "block" : "none");
    $('#scale_api').css("display", selectedApi == 'scale' ? "block" : "none");
    $('#openai_max_gen_block').css("display", selectedApi == 'openai' ? "block" : "none");
    $('#openai_context_block').css("display", selectedApi == 'openai' ? "block" : "none");
	$('#scale_max_gen_block').css("display", selectedApi == 'scale' ? "block" : "none");
	$('#scale_max_context_block').css("display", selectedApi == 'scale' ? "block" : "none");
    $('#tweak_hr').css("display", selectedApi == 'openai' ? "block" : "none");
	$('#tweak_hr').css("display", selectedApi == 'scale' ? "block" : "none");
    //doesnt work with scale
    $('#openai_streaming').css("display", selectedApi == 'openai' ? "block" : "none");
    switch (selectedApi) {
    case 'kobold':
        main_api = 'kobold';
        $('#max_context_block').removeClass('generic_hidden')
        $('#amount_gen_block').removeClass('generic_hidden')
        $('#openai_gen_block').removeClass('generic_hidden')
        $('#tweak_container').addClass('generic_hidden');
        break;
    case 'novel':
        main_api = 'novel';
        $('#max_context_block').addClass('generic_hidden')
        $('#amount_gen_block').addClass('generic_hidden')
        $('#openai_gen_block').addClass('generic_hidden')
        $('#tweak_container').addClass('generic_hidden');
        break;
    case 'openai':
        main_api = 'openai';
        $('#max_context_block').addClass('generic_hidden')
        $('#amount_gen_block').addClass('generic_hidden')
        $('#tweak_container').removeClass('generic_hidden');
        break;
        case 'scale':
            main_api = 'scale';
            $('#max_context_block').addClass('generic_hidden')
            $('#amount_gen_block').addClass('generic_hidden')
            $('#openai_gen_block').addClass('generic_hidden')
            $('#tweak_container').removeClass('generic_hidden');
        break;
        default:
    console.error(`Unknown API selected: ${selectedApi}`);
    break;
    }
}
async function getUserAvatars() {
    const response = await fetch("/getuseravatars", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token
        },
        body: JSON.stringify({
            "": ""
        })

    });
    if (response.ok === true) {
        const getData = await response.json();
        const avatarTemplate = (avatar) => `
            <div imgfile="${avatar}" class="avatar">
                <img src="User Avatars/${avatar}" width="60px" height="120px">
            </div>
        `;
        getData.forEach((avatar) => {
            $("#user_avatar_block").append(avatarTemplate(avatar));
        });
    }
    
}


$(document).on('input', '#temp', function () {
    temp_kobold = $(this).val();
    if (isInt(temp_kobold)) {
        $('#temp_counter').html($(this).val() + ".00");
    } else {
        $('#temp_counter').html($(this).val());
    }
    var tempTimer = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#amount_gen', function () {
    kobold_amount_gen = $(this).val();
    $('#amount_gen_counter').html($(this).val());
    var amountTimer = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#max_context', function () {
    Kobold_max_context = parseInt($(this).val());
    $('#max_context_counter').html($(this).val() + ' Tokens');
    var max_contextTimer = setTimeout(saveSettings, durationSaveContext);
});
$('#style_anchor').change(function () {
    style_anchor = !!$('#style_anchor').prop('checked');
    saveSettings();
});
$('#character_anchor').change(function () {
    character_anchor = !!$('#character_anchor').prop('checked');
    saveSettings();
});
$(document).on('input', '#rep_pen', function () {
    rep_pen = $(this).val();
    if (isInt(rep_pen)) {
        $('#rep_pen_counter').html($(this).val() + ".00");
    } else {
        $('#rep_pen_counter').html($(this).val());
    }
    var repPenTimer = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#rep_pen_size', function () {
    rep_pen_size = $(this).val();
    $('#rep_pen_size_counter').html($(this).val() + " Tokens");
    var repPenSizeTimer = setTimeout(saveSettings, durationSaveContext);
});

//Novel
$(document).on('input', '#temp_novel', function () {
    temp_novel = $(this).val();

    if (isInt(temp_novel)) {
        $('#temp_counter_novel').html($(this).val() + ".00");
    } else {
        $('#temp_counter_novel').html($(this).val());
    }
    var tempTimer_novel = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#rep_pen_novel', function () {
    rep_pen_novel = $(this).val();
    if (isInt(rep_pen_novel)) {
        $('#rep_pen_counter_novel').html($(this).val() + ".00");
    } else {
        $('#rep_pen_counter_novel').html($(this).val());
    }
    var repPenTimer_novel = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#rep_pen_size_novel', function () {
    rep_pen_size_novel = $(this).val();
    $('#rep_pen_size_counter_novel').html($(this).val() + " Tokens");
    var repPenSizeTimer_novel = setTimeout(saveSettings, durationSaveContext);
});

//OpenAi
$(document).on('input', '#temp_openai', function () {
    temp_openai = $(this).val();

    if (isInt(temp_openai)) {
        $('#temp_counter_openai').html($(this).val() + ".00");
    } else {
        $('#temp_counter_openai').html($(this).val());
    }
    var tempTimer_openai = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#freq_pen_openai', function () {
    freq_pen_openai = $(this).val();
    if (isInt(freq_pen_openai)) {
        $('#freq_pen_counter_openai').html($(this).val() + ".00");
    } else {
        $('#freq_pen_counter_openai').html($(this).val());
    }
    var freqPenTimer_openai = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#pres_pen_openai', function () {
    pres_pen_openai = $(this).val();
    if (isInt(pres_pen_openai)) {
        $('#pres_pen_counter_openai').html($(this).val() + ".00");
    } else {
        $('#pres_pen_counter_openai').html($(this).val());
    }
    var presPenTimer_openai = setTimeout(saveSettings, durationSaveContext);
});

function update_OAI_contx(){
    let text = ' Tokens'
    if (openai_selected_context < openai_min_gen){openai_selected_context = openai_min_gen; text +=` (${openai_min_gen} minimum)`}
    if (openai_selected_context > openai_max_gen){openai_selected_context = openai_max_gen; text +=` (${openai_max_gen} maximum)`}
    $('#OAI_context_display').html(openai_selected_context + text);
    $('#OAI_context_input').val(openai_selected_context);
    $('#OAI_context_slider').val(openai_selected_context);
    //console.log(openai_selected_context)
    token_cost_converter()
    clearTimeout(max_contextTimer)
    var max_contextTimer = setTimeout(saveSettings, durationSaveContext);
}

$(document).on('input', '#OAI_context_input', function () {
    openai_selected_context = parseInt($(this).val());
    update_OAI_contx()
});

$(document).on('input', '#OAI_context_slider', function () {
    openai_selected_context = parseInt($(this).val());
    update_OAI_contx()
});

$(document).on('click', '#OAI_contx_button', function () {
    openai_selected_context = parseInt($(this).val());
    update_OAI_contx()
});

$(document).on('input', '#scale_max_context', function () {
    scale_max_context = parseInt($(this).val());
    $('#scale_max_context_counter').html($(this).val() + ' Tokens');
    var max_contextTimer = setTimeout(saveSettings, durationSaveContext);
});
$(document).on('input', '#scale_max_gen', function () {
    scale_max_gen = parseInt($(this).val());
    $('#scale_max_tokens_counter').html($(this).val() + ' Tokens');
    var max_tokensTimer = setTimeout(saveSettings, durationSaveContext);
});

function update_OAI_gen(){
    let text = ' Tokens'
    if (openai_selected_gen < openai_min_gen){openai_selected_gen = openai_min_gen; text +=` (${openai_min_gen} minimum)`}
    if (openai_selected_gen > openai_max_gen){openai_selected_gen = openai_max_gen; text +=` (${openai_max_gen} maximum)`}
    $('#OAI_gen_display').html(openai_selected_gen + text);
    $('#OAI_gen_input').val(openai_selected_gen);
    $('#OAI_gen_slider').val(openai_selected_gen);
    //console.log(openai_selected_gen)
    token_cost_converter()
    clearTimeout(max_contextTimer)
    var max_contextTimer = setTimeout(saveSettings, durationSaveContext);
}

$(document).on('input', '#OAI_gen_input', function () {
    openai_selected_gen = parseInt($(this).val());
    update_OAI_gen()
});
$(document).on('input', '#OAI_gen_slider', function () {
    openai_selected_gen = parseInt($(this).val());
    update_OAI_gen()
});
$(document).on('click', '#OAI_gen_button', function () {
    openai_selected_gen = parseInt($(this).val());
    update_OAI_gen()
});

//absolutely could compress these to be loop implementation
$('#stream_toggle').change(function () {
    stream_openai = !!$('#stream_toggle').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#nsfw_toggle').change(function () {
    nsfw_toggle = !!$('#nsfw_toggle').prop('checked');
    saveSettings();
});$('#CYOA_mode').change(function () {
    CYOA_mode = !!$('#CYOA_mode').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#custom_1_switch').change(function () {
    custom_1_switch = !!$('#custom_1_switch').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#custom_2_switch').change(function () {
    custom_2_switch = !!$('#custom_2_switch').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#custom_3_switch').change(function () {
    custom_3_switch = !!$('#custom_3_switch').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#custom_4_switch').change(function () {
    custom_4_switch = !!$('#custom_4_switch').prop('checked');
    saveSettings();
    build_main_system_message()
});
$('#custom_5_switch').change(function () {
    custom_5_switch = !!$('#custom_5_switch').prop('checked');
    saveSettings();
    build_main_system_message()
});

//submenu stuff
$('#open_last_char_togg').change(function () {
    open_last_char = !!$('#open_last_char_togg').prop('checked');
    saveSettings();
});
$('#open_sett_start').change(function () {
    open_nav_bar = !!$('#open_sett_start').prop('checked');
    saveSettings();
});
$('#open_bg_start').change(function () {
    open_bg_bar = !!$('#open_bg_start').prop('checked');
    saveSettings();
});

//***************SETTINGS****************//
///////////////////////////////////////////
async function getSettings(type) {//timer
    jQuery.ajax({
        type: 'POST',
        url: '/getsettings',
        data: JSON.stringify({}),
        beforeSend: function () {
        },
        cache: false,
        dataType: "json",
        contentType: "application/json",
        //processData: false, 
        success: function (data) {
            if (data.result != 'file not find') {
                settings = JSON.parse(data.settings);
                if (settings.username !== undefined) {
                    if (settings.username !== '') {
                        curr_username = settings.username;
                        $('#your_name').val(curr_username);
                    }
                }

                //Novel
                if (settings.main_api != undefined) {
                    main_api = settings.main_api;
                    $("#main_api option[value=" + main_api + "]").attr('selected', 'true');
                    changeMainAPI();
                }
                if (settings.api_key_novel != undefined) {
                    api_key_novel = settings.api_key_novel;
                    $("#api_key_novel").val(api_key_novel);
                }
                model_novel = settings.model_novel;
                $("#model_novel_select option[value=" + model_novel + "]").attr('selected', 'true');

                novelai_setting_names = data.novelai_setting_names;
                novelai_settings = data.novelai_settings;
                novelai_settings.forEach(function (item, i, arr) {

                    novelai_settings[i] = JSON.parse(item);
                });
                var arr_holder = {};
                $("#settings_perset_novel").empty();
                novelai_setting_names.forEach(function (item, i, arr) {
                    arr_holder[item] = i;
                    $('#settings_perset_novel').append('<option value=' + i + '>' + item + '</option>');

                });
                novelai_setting_names = {};
                novelai_setting_names = arr_holder;

                preset_settings_novel = settings.preset_settings_novel;
                $("#settings_perset_novel option[value=" + novelai_setting_names[preset_settings_novel] + "]").attr('selected', 'true');

                //OpenAI
                if (settings.api_key_openai != undefined) {
                    api_key_openai = settings.api_key_openai;
                    $("#api_key_openai").val(api_key_openai);
                }
                openai_setting_names = data.openai_setting_names;
                openai_settings = data.openai_settings;
                openai_settings.forEach(function (item, i, arr) {
                    openai_settings[i] = JSON.parse(item);
                });
                var arr_holder = {};
                $("#settings_perset_openai").empty();
                openai_setting_names.forEach(function (item, i, arr) {
                    arr_holder[item] = i;
                    $('#settings_perset_openai').append('<option value=' + i + '>' + item + '</option>');

                });
                openai_setting_names = {};
                openai_setting_names = arr_holder;

                preset_settings_openai = settings.preset_settings_openai;
                $("#settings_perset_openai option[value=" + openai_setting_names[preset_settings_openai] + "]").attr('selected', 'true');

				//Scale
                if (settings.api_key_scale != undefined) {
                    api_key_scale = settings.api_key_scale;
                    $("#api_key_scale").val(api_key_scale);
                }
                if (settings.api_url_scale != undefined) {
                    api_url_scale = settings.api_url_scale;
                    $("#api_url_scale").val(api_url_scale);
                }
                scale_setting_names = data.scale_setting_names;
                scale_settings = data.scale_settings;
                scale_settings.forEach(function (item, i, arr) {
                    scale_settings[i] = JSON.parse(item);
                });
                var arr_holder = {};
                $("#settings_perset_scale").empty();
                scale_setting_names.forEach(function (item, i, arr) {
                    arr_holder[item] = i;
                    $('#settings_perset_scale').append('<option value=' + i + '>' + item + '</option>');

                });
                scale_setting_names = {};
                scale_setting_names = arr_holder;

                preset_settings_scale = settings.preset_settings_scale;
                $("#settings_perset_scale option[value=" + scale_setting_names[preset_settings_scale] + "]").attr('selected', 'true');
				
                //Kobold
                koboldai_setting_names = data.koboldai_setting_names;
                koboldai_settings = data.koboldai_settings;
                koboldai_settings.forEach(function (item, i, arr) {
                    koboldai_settings[i] = JSON.parse(item);
                });
                var arr_holder = {};
                //$("#settings_perset").empty();
                koboldai_setting_names.forEach(function (item, i, arr) {
                    arr_holder[item] = i;
                    $('#settings_perset').append('<option value=' + i + '>' + item + '</option>');

                });
                koboldai_setting_names = {};
                koboldai_setting_names = arr_holder;

                preset_settings = settings.preset_settings;

                temp_kobold = settings.temp_kobold;
                kobold_amount_gen = settings.kobold_amount_gen;
                if (settings.Kobold_max_context !== undefined) Kobold_max_context = parseInt(settings.Kobold_max_context);
                if (settings.anchor_order !== undefined) anchor_order = parseInt(settings.anchor_order);
                if (settings.style_anchor !== undefined) style_anchor = !!settings.style_anchor;
                if (settings.character_anchor !== undefined) character_anchor = !!settings.character_anchor;
                rep_pen = settings.rep_pen;
                rep_pen_size = settings.rep_pen_size;


                var addZeros = "";
                if (isInt(temp_kobold)) addZeros = ".00";
                $('#temp').val(temp_kobold);
                $('#temp_counter').html(temp_kobold + addZeros);

                $('#style_anchor').prop('checked', style_anchor);
                $('#character_anchor').prop('checked', character_anchor);
                $("#anchor_order option[value=" + anchor_order + "]").attr('selected', 'true');

                $('#max_context').val(Kobold_max_context);
                $('#max_context_counter').html(Kobold_max_context + ' Tokens');

                $('#amount_gen').val(kobold_amount_gen);
                $('#amount_gen_counter').html(kobold_amount_gen + ' Tokens');

                addZeros = "";
                if (isInt(rep_pen)) addZeros = ".00";
                $('#rep_pen').val(rep_pen);
                $('#rep_pen_counter').html(rep_pen + addZeros);

                $('#rep_pen_size').val(rep_pen_size);
                $('#rep_pen_size_counter').html(rep_pen_size + " Tokens");

                //Novel
                temp_novel = settings.temp_novel;
                rep_pen_novel = settings.rep_pen_novel;
                rep_pen_size_novel = settings.rep_pen_size_novel;

                addZeros = "";
                if (isInt(temp_novel)) addZeros = ".00";
                $('#temp_novel').val(temp_novel);
                $('#temp_counter_novel').html(temp_novel + addZeros);

                addZeros = "";
                if (isInt(rep_pen_novel)) addZeros = ".00";
                $('#rep_pen_novel').val(rep_pen_novel);
                $('#rep_pen_counter_novel').html(rep_pen_novel + addZeros);

                $('#rep_pen_size_novel').val(rep_pen_size_novel);
                $('#rep_pen_size_counter_novel').html(rep_pen_size_novel + " Tokens");

                //OpenAI, with default settings too
                temp_openai = settings.temp_openai ?? 0.9;
                freq_pen_openai = settings.freq_pen_openai ?? 0.7;
                pres_pen_openai = settings.pres_pen_openai ?? 0.7;
                stream_openai = settings.stream_openai ?? true;
                openai_selected_context = settings.openai_selected_context ?? 4095;
                openai_selected_gen = settings.openai_selected_gen ?? 300;
                //future me remember !! converts to bool, ?? is a null check
                if (settings.nsfw_toggle !== undefined) nsfw_toggle = !!settings.nsfw_toggle;
                if (settings.CYOA_mode !== undefined) CYOA_mode = !!settings.CYOA_mode;
                if (settings.keep_example_dialogue !== undefined) keep_example_dialogue = !!settings.keep_example_dialogue;
                //bookmark
                if (settings.open_last_char !== undefined) open_last_char = !!settings.open_last_char;
                if (settings.open_nav_bar !== undefined) open_nav_bar = !!settings.open_nav_bar;
                if (settings.open_bg_bar !== undefined) open_bg_bar = !!settings.open_bg_bar;
                last_char = settings.last_char ?? "";
                //5 min 
                bg_shuffle_delay = settings.bg_shuffle_delay ?? 300000;
                //default to character list
                last_menu = settings.last_menu ?? "char_list";

                //cheeky use of default values being in index
                system_prompt = settings.system_prompt ?? document.getElementById("system_prompt").value
                description_prompt = settings.description_prompt ?? document.getElementById("desc_prompt").value
                personality_prompt = settings.personality_prompt ?? document.getElementById("personality_prompt").value
                scenario_prompt = settings.scenario_prompt ?? document.getElementById("scenario_prompt").value
                NSFW_on_prompt = settings.NSFW_on_prompt ?? document.getElementById("NSFW_ON_prompt").value
                NSFW_off_prompt = settings.NSFW_off_prompt ?? document.getElementById("NSFW_OFF_prompt").value
                CYOA_prompt = settings.CYOA_prompt ?? document.getElementById("CYOA_prompt").value

                if (settings.custom_1_switch !== undefined) custom_1_switch = !!settings.custom_1_switch;
                if (settings.custom_2_switch !== undefined) custom_2_switch = !!settings.custom_2_switch;
                if (settings.custom_3_switch !== undefined) custom_3_switch = !!settings.custom_3_switch;
                if (settings.custom_4_switch !== undefined) custom_4_switch = !!settings.custom_4_switch;
                if (settings.custom_5_switch !== undefined) custom_5_switch = !!settings.custom_5_switch;
                if (settings.auto_retry !== undefined) auto_retry = !!settings.auto_retry;
                if (settings.continuous_mode !== undefined) continuous_mode = !!settings.continuous_mode;

                for (let i = 1; i <= 5; i++) {
                    const settingTitle = `custom_${i}_title`;
                    const defaultTitle = document.getElementById(`CUST_${i}_title`).defaultValue;
                    if (settings[settingTitle] == undefined) {
                      eval(`custom_${i}_title = defaultTitle`);
                    } else {
                      eval(`custom_${i}_title = settings.${settingTitle}`);
                    }
                  }
                

                if (settings.custom_1_desc == undefined) custom_1_desc = document.getElementById("CUST_1_description").defaultValue
                else{
                    custom_1_desc = settings.custom_1_desc
                }
                if (settings.custom_2_desc== undefined) custom_2_desc = document.getElementById("CUST_2_description").defaultValue
                else{
                    custom_2_desc = settings.custom_2_desc
                }
                if (settings.custom_3_desc== undefined) custom_3_desc = document.getElementById("CUST_3_description").defaultValue
                else{
                    custom_3_desc = settings.custom_3_desc
                }
                if (settings.custom_4_desc == undefined) custom_4_desc = document.getElementById("CUST_4_description").defaultValue
                else{
                    custom_4_desc = settings.custom_4_desc
                }
                if (settings.custom_5_desc == undefined) custom_5_desc = document.getElementById("CUST_5_description").defaultValue
                else{
                    custom_5_desc = settings.custom_5_desc
                }


                if (settings.custom_1_prompt == undefined) custom_1_prompt = document.getElementById("CUST_1_Prompt").defaultValue
                else{
                    custom_1_prompt =settings.custom_1_prompt
                }
                if (settings.custom_2_prompt == undefined) custom_2_prompt = document.getElementById("CUST_2_Prompt").defaultValue
                else{
                    custom_2_prompt =settings.custom_2_prompt
                }
                if (settings.custom_3_prompt == undefined) custom_3_prompt = document.getElementById("CUST_3_Prompt").defaultValue
                else{
                    custom_3_prompt =settings.custom_3_prompt
                }
                if (settings.custom_4_prompt == undefined) custom_4_prompt = document.getElementById("CUST_4_Prompt").defaultValue
                else{
                    custom_4_prompt =settings.custom_4_prompt
                }
                if (settings.custom_5_prompt == undefined) custom_5_prompt = document.getElementById("CUST_5_Prompt").defaultValue
                else{
                    custom_5_prompt =settings.custom_5_prompt
                }
                
                $('#stream_toggle').prop('checked', stream_openai);

                $('#OAI_context_input').val(openai_selected_context);
                $('#OAI_context_slider').val(openai_selected_context);
                $('#OAI_context_display').html(openai_selected_context + ' Tokens');
                $('#OAI_gen_input').val(openai_selected_gen);
                $('#OAI_gen_slider').val(openai_selected_gen);
                $('#OAI_gen_display').html(openai_selected_gen + ' Tokens');
                token_cost_converter()
				
				// Scale max context (supposedly 8k, but 7.5k max because we're using the wrong tokenizer)
                scale_max_context = settings.scale_max_context ?? 7750;
                scale_max_gen = settings.scale_max_gen ?? 400;
                $('#scale_max_context').val(scale_max_context);
                $('#scale_max_context_counter').html(scale_max_context + ' Tokens');
                $('#scale_max_gen').val(scale_max_gen);
                $('#scale_max_tokens_counter').html(scale_max_gen + ' Tokens');


                //set switches
                $('#keep_example_dialogue').prop('checked', keep_example_dialogue);
                $('#nsfw_toggle').prop('checked', nsfw_toggle);
                $('#CYOA_mode').prop('checked', CYOA_mode);
                $('#custom_1_switch').prop('checked', custom_1_switch);
                $('#custom_2_switch').prop('checked', custom_2_switch);
                $('#custom_3_switch').prop('checked', custom_3_switch);
                $('#custom_4_switch').prop('checked', custom_4_switch);
                $('#custom_5_switch').prop('checked', custom_5_switch);
                //set system prompt text fields
                document.getElementById("system_prompt").value = system_prompt
                document.getElementById("desc_prompt").value = description_prompt
                document.getElementById("personality_prompt").value = personality_prompt
                document.getElementById("scenario_prompt").value = scenario_prompt
                //NSFW
                document.getElementById("NSFW_ON_prompt").value = NSFW_on_prompt
                document.getElementById("NSFW_OFF_prompt").value = NSFW_off_prompt
                //CYOA
                document.getElementById("CYOA_prompt").value = CYOA_prompt
                //set titles
                document.getElementById("custom_1_title").innerHTML = custom_1_title
                document.getElementById("custom_2_title").innerHTML = custom_2_title
                document.getElementById("custom_3_title").innerHTML = custom_3_title
                document.getElementById("custom_4_title").innerHTML = custom_4_title
                document.getElementById("custom_5_title").innerHTML = custom_5_title
                //populate text fields in settings
                document.getElementById("CUST_1_title").value = custom_1_title
                document.getElementById("CUST_2_title").value = custom_2_title
                document.getElementById("CUST_3_title").value = custom_3_title
                document.getElementById("CUST_4_title").value = custom_4_title
                document.getElementById("CUST_5_title").value = custom_5_title
                //set desc titles
                document.getElementById("custom_1_desc").innerHTML = custom_1_desc
                document.getElementById("custom_2_desc").innerHTML = custom_2_desc
                document.getElementById("custom_3_desc").innerHTML = custom_3_desc
                document.getElementById("custom_4_desc").innerHTML = custom_4_desc
                document.getElementById("custom_5_desc").innerHTML = custom_5_desc
                //populate text fields in settings
                document.getElementById("CUST_1_description").value = custom_1_desc
                document.getElementById("CUST_2_description").value = custom_2_desc
                document.getElementById("CUST_3_description").value = custom_3_desc
                document.getElementById("CUST_4_description").value = custom_4_desc
                document.getElementById("CUST_5_description").value = custom_5_desc
                //populate text fields in settings
                document.getElementById("CUST_1_Prompt").value = custom_1_prompt
                document.getElementById("CUST_2_Prompt").value = custom_2_prompt
                document.getElementById("CUST_3_Prompt").value = custom_3_prompt
                document.getElementById("CUST_4_Prompt").value = custom_4_prompt
                document.getElementById("CUST_5_Prompt").value = custom_5_prompt
                //auto retry and continuous
                $("#auto_retry").prop('checked', auto_retry)
                $("#continuous_mode").prop('checked', continuous_mode)


                //bookmark
                $('#open_last_char_togg').prop('checked', open_last_char);
                $('#open_sett_start').prop('checked', open_nav_bar);
                $('#open_bg_start').prop('checked', open_bg_bar);

                addZeros = "";
                if (isInt(temp_openai)) addZeros = ".00";
                $('#temp_openai').val(temp_openai);
                $('#temp_counter_openai').html(temp_openai + addZeros);

                addZeros = "";
                if (isInt(freq_pen_openai)) addZeros = ".00";
                $('#freq_pen_openai').val(freq_pen_openai);
                $('#freq_pen_counter_openai').html(freq_pen_openai + addZeros);

                addZeros = "";
                if (isInt(pres_pen_openai)) addZeros = ".00";
                $('#pres_pen_openai').val(pres_pen_openai);
                $('#pres_pen_counter_openai').html(pres_pen_openai + addZeros);

                //////////////////////
                if (preset_settings == 'gui') {
                    $("#settings_perset option[value=gui]").attr('selected', 'true');
                    $("#range_block").children().prop("disabled", true);
                    $("#range_block").css('opacity', 0.5);

                    $("#amount_gen_block").children().prop("disabled", true);
                    $("#amount_gen_block").css('opacity', 0.45);
                } else {
                    if (typeof koboldai_setting_names[preset_settings] !== 'undefined') {

                        $("#settings_perset option[value=" + koboldai_setting_names[preset_settings] + "]").attr('selected', 'true');
                    } else {
                        $("#range_block").children().prop("disabled", true);
                        $("#range_block").css('opacity', 0.5);
                        $("#amount_gen_block").children().prop("disabled", true);
                        $("#amount_gen_block").css('opacity', 0.45);

                        preset_settings = 'gui';
                        $("#settings_perset option[value=gui]").attr('selected', 'true');
                    }

                }
                //User
                user_avatar = settings.user_avatar;
                $('.mes').each(function () {
                    if ($(this).attr('ch_name') == curr_username) {
                        $(this).children('.avatar').children('img').attr('src', 'User Avatars/' + user_avatar);
                    }
                });

                kobold_API_key = settings.api_server;
                $('#api_url_text').val(kobold_API_key);
            }
            if (!is_checked_colab) isColab();

        },
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);

        }
    });

}

//save settings function
async function saveSettings(type) {
    jQuery.ajax({
        type: 'POST',
        url: '/savesettings',
        data: JSON.stringify({
            api_key_novel: api_key_novel,
            api_key_openai: api_key_openai,
            kobold_API_key: kobold_API_key,
            anchor_order: anchor_order,
            bg_shuffle_delay: bg_shuffle_delay,
            character_anchor: character_anchor,
            CYOA_mode: CYOA_mode,
            freq_pen_openai: freq_pen_openai,
            keep_example_dialogue: keep_example_dialogue,
            kobold_amount_gen: kobold_amount_gen,
            last_char : last_char,
            last_menu: last_menu,
            max_context: Kobold_max_context,
            main_api: main_api,
            model_novel: model_novel,
            nsfw_toggle: nsfw_toggle,
            openai_selected_context: openai_selected_context,
            openai_selected_gen: openai_selected_gen,
            open_bg_bar: open_bg_bar,
            open_nav_bar: open_nav_bar,
            open_last_char: open_last_char,
            preset_settings: preset_settings,
            preset_settings_novel: preset_settings_novel,
            preset_settings_openai: preset_settings_openai,
            pres_pen_openai: pres_pen_openai,
            rep_pen: rep_pen,
            rep_pen_size: rep_pen_size,
            rep_pen_novel: rep_pen_novel,
            rep_pen_size_novel: rep_pen_size_novel,
            style_anchor: style_anchor,
            stream_openai: stream_openai,
            temp_kobold: temp_kobold,
            temp_novel: temp_novel,
            temp_openai: temp_openai,
            username: curr_username,
            user_avatar: user_avatar,
			api_key_scale: api_key_scale,
            api_url_scale: api_url_scale,
            scale_max_context: scale_max_context,
            scale_max_gen: scale_max_gen,
            system_prompt : system_prompt,
            description_prompt : description_prompt,
            personality_prompt: personality_prompt,
            scenario_prompt : scenario_prompt,
            NSFW_on_prompt: NSFW_on_prompt,
            NSFW_off_prompt:NSFW_off_prompt,
            CYOA_prompt:CYOA_prompt,
            custom_1_switch : custom_1_switch,
            custom_2_switch : custom_2_switch,
            custom_3_switch : custom_3_switch,
            custom_4_switch : custom_4_switch,
            custom_5_switch : custom_5_switch,
            custom_1_title : custom_1_title,
            custom_2_title : custom_2_title,
            custom_3_title : custom_3_title,
            custom_4_title : custom_4_title,
            custom_5_title : custom_5_title,
            custom_1_desc : custom_1_desc,
            custom_2_desc : custom_2_desc,
            custom_3_desc : custom_3_desc,
            custom_4_desc : custom_4_desc,
            custom_5_desc : custom_5_desc,
            custom_1_prompt : custom_1_prompt,
            custom_2_prompt: custom_2_prompt,
            custom_3_prompt: custom_3_prompt,
            custom_4_prompt: custom_4_prompt,
            custom_5_prompt: custom_5_prompt,
            auto_retry: auto_retry,
            continuous_mode: continuous_mode,

        }),
        cache: false,
        dataType: "json",
        contentType: "application/json",
        //processData: false, 
        success: function (data) {
            lower_save_flag()
            clearTimeout(timerSaveEdit);
            //online_status = data.result;
            if (type === 'change_name') {
                location.reload();
            }
        },
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);
        }
    });

}
$('#select_chat_cross').click(function () {
    $('#shadow_select_chat_popup').addClass('generic_hidden')
    $('#load_select_chat_div').removeClass('generic_hidden')
});

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}
//********************
//***Message Editor***
$(document).on('click', '.mes_edit', function () {
    if (active_character_index !== undefined) {
        let chatScrollPosition = $("#chat").scrollTop();
        if (this_edit_mes_id !== undefined) {
            let mes_edited = $('#chat').children().filter('[mesid="' + this_edit_mes_id + '"]').children('.mes_block').children('.ch_name').children('.mes_edit_done');
            messageEditDone(mes_edited);
        }
        $(this).parent().parent().children('.mes_text').empty();
        $(this).addClass('generic_hidden')
        $(this).parent().children('.mes_edit_done').removeClass('generic_hidden')
        $(this).parent().children('.mes_edit_cancel').removeClass('generic_hidden')

        var edit_mes_id = $(this).parent().parent().parent().attr('mesid');
        this_edit_mes_id = edit_mes_id;

        var text = chat_mess_content[edit_mes_id]['swipe_array'][swipe_index];
        if (chat_mess_content[edit_mes_id]['is_user']) {
            this_edit_mes_chname = curr_username;
        } else {
            this_edit_mes_chname = curr_charname;
        }
        text = text.trim();
        $(this).parent().parent().children('.mes_text').append('<textarea class=edit_textarea style="max-width:auto; ">' + text + '</textarea>');
        let edit_textarea = $(this).parent().parent().children('.mes_text').children('.edit_textarea');
        edit_textarea.css('opacity', 0.0);
        edit_textarea.transition({
            opacity: 1.0,
            duration: 0,
            easing: "",
            complete: function () { }
        });
        edit_textarea.height(0);
        edit_textarea.height(edit_textarea[0].scrollHeight);
        edit_textarea.focus();
        edit_textarea[0].setSelectionRange(edit_textarea.val().length, edit_textarea.val().length);
        if (this_edit_mes_id == curr_message_id - 1) {
            $("#chat").scrollTop(chatScrollPosition);
        }
    }
});
$(document).on('click', '.mes_edit_cancel', function () {
    //var text = $(this).parent().parent().children('.mes_text').children('.edit_textarea').val();
    var text = chat_mess_content[this_edit_mes_id]['swipe_array'][swipe_index];

    $(this).parent().parent().children('.mes_text').empty();
    $(this).addClass('generic_hidden')
    $(this).parent().children('.mes_edit_done').addClass('generic_hidden')
    $(this).parent().children('.mes_edit').removeClass('generic_hidden')
    $(this).parent().parent().children('.mes_text').append(messageFormating(text, this_edit_mes_chname));
    this_edit_mes_id = undefined;
});
$(document).on('click', '.mes_edit_done', function () {
    messageEditDone($(this));
});
function messageEditDone(div) {
    var text = div.parent().parent().children('.mes_text').children('.edit_textarea').val();
    //var text = chat[this_edit_mes_id];
    text = text.trim();
    chat_mess_content[this_edit_mes_id]['swipe_array'][swipe_index] = text;
    div.parent().parent().children('.mes_text').empty();
    div.addClass('generic_hidden')
    div.parent().children('.mes_edit_cancel').addClass('generic_hidden')
    div.parent().children('.mes_edit').removeClass('generic_hidden')
    div.parent().parent().children('.mes_text').append(messageFormating(text, this_edit_mes_chname));
    this_edit_mes_id = undefined;
    saveChat();
}

$("#your_name_button").click(function () {
    if (!is_send_press) {
        curr_username = $("#your_name").val();
        if (curr_username === undefined || curr_username == '') curr_username = default_user_name;
        console.log(curr_username);
        soft_refresh()
        //the insane bastard somehow uses username as a validator somwhere in server.js so we need to reload
        saveSettings("change_name");

    }
});
//Select chat
async function getAllCharaChats() {
    $('#select_chat_div').html('');
    jQuery.ajax({
        type: 'POST',
        url: '/getallchatsofchatacter',
        data: JSON.stringify({ avatar_url: characters_array[active_character_index].avatar }),
        cache: false,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data == 'empty')
            {console.log(`no chats found`)}
            $('#load_select_chat_div').addClass('generic_hidden')
            let dataArr = Object.values(data);
            //what is this here for?
            //sorts by timestamp dumbass
            var sortedSet
            try {
                sortedSet = Object.values(data).sort((a, b) => new Date(b['last_open_date']) - new Date(a['last_open_date']));
            } catch (error) {
                console.log(error)
                sortedSet = dataArr
            }
            for (const key in sortedSet) {
                let strlen = 200;
                let mes = sortedSet[key]['swipe_array'][swipe_index];
                if (mes.length > strlen) {
                    mes = '...' + mes.substring(mes.length - strlen);
                }
                mes = format_raw(mes)
                var date = `Date: ${new Date(Number(sortedSet[key]['file_name'].replace('.jsonl',''))).toLocaleDateString('en-US')}`;
                if (date == "Date: Invalid Date"){
                    date = `Filename: ${sortedSet[key]['file_name'].replace('.jsonl','')}`
                }
                $('#select_chat_div').append('<div class="select_chat_block" file_name="' +
                sortedSet[key]['file_name'] + '"><div class=avatar><img src="characters/' +
                characters_array[active_character_index]['avatar'] + '" style="width: 33px; height: 51px;"></div><div class="select_chat_block_filename">' +
                date + '</div><div class="select_chat_block_mes">' +
                mes + '</div></div><hr>');
                //highlights last chat
                document.getElementsByClassName('select_chat_block')[0].classList.add("highlighted");
            }
        },
        error: function (jqXHR, exception) {
            console.log(exception);
            console.log(jqXHR);
        }
    });
}

$("#model_novel_select").change(function () {
    model_novel = $('#model_novel_select').find(":selected").val();
    saveSettings();
});
$("#anchor_order").change(function () {
    anchor_order = parseInt($('#anchor_order').find(":selected").val());
    saveSettings();
});


function compareVersions(v1, v2) {
    const v1parts = v1.split('.');
    const v2parts = v2.split('.');
    for (let i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) {
            return 1;
        }
        if (v1parts[i] === v2parts[i]) {
            continue;
        }
        if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }
    if (v1parts.length != v2parts.length) {
        return -1;
    }
    return 0;
}

$("#anchor_order").change(function () {
    anchor_order = parseInt($('#anchor_order').find(":selected").val());
    saveSettings();
});


//**************************CHARACTER IMPORT EXPORT*************************//
$("#character_import_button").click(function () {
    $("#character_import_file").click();
});
$("#character_import_file").on("change", function (e) {
    $('#rm_info_avatar').html('');
    var file = e.target.files[0];
    //console.log(1);
    if (!file) {
        return;
    }
    var ext = file.name.match(/\.(\w+)$/);
    if (!ext || (ext[1].toLowerCase() != "json" && ext[1].toLowerCase() != "png")) {
        return;
    }

    var format = ext[1].toLowerCase();
    $("#character_import_file_type").val(format);
    //console.log(format);
    var formData = new FormData($("#form_import").get(0));

    jQuery.ajax({
        type: 'POST',
        url: '/importcharacter',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.file_name !== undefined) {
                $('#rm_info_block').transition({ opacity: 0, duration: 0 });
                var $prev_img = $('#avatar_div_div').clone();
                $prev_img.children('img').attr('src', 'characters/' + data.file_name + '.png');
                $('#rm_info_avatar').append($prev_img);
                select_rm_info("Character created");
                $('#rm_info_block').transition({ opacity: 1.0, duration: 2000 });
                getCharacters();
            }
        },
        error: function (jqXHR, exception) {
            $('#create_button').removeAttr("disabled");
        }
    });
});
$('#export_button').click(function () {
    var link = document.createElement('a');
    link.href = 'characters/' + characters_array[active_character_index].avatar;
    link.download = characters_array[active_character_index].avatar;
    document.body.appendChild(link);
    link.click();
});



//**************************CHAT IMPORT EXPORT*************************//
$("#chat_import_button").click(function () {
    $("#chat_import_file").click();
});
$("#chat_import_file").on("change", function (e) {
    var file = e.target.files[0];
    //console.log(1);
    if (!file) {
        return;
    }
    var ext = file.name.match(/\.(\w+)$/);
    if (!ext || (ext[1].toLowerCase() != "json" && ext[1].toLowerCase() != "jsonl")) {
        return;
    }

    var format = ext[1].toLowerCase();
    $("#chat_import_file_type").val(format);
    //console.log(format);
    var formData = new FormData($("#form_import_chat").get(0));

    jQuery.ajax({
        type: 'POST',
        url: '/importchat',
        data: formData,
        beforeSend: function () {
            $('#select_chat_div').html('');
            $('#load_select_chat_div').removeClass('generic_hidden')
        },
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.res) {
                getAllCharaChats();
            }
        },
        error: function (jqXHR, exception) {
            $('#create_button').removeAttr("disabled");
        }
    });
});
$(document).on('click', '.select_chat_block', function () {
    var file_name = $(this).attr("file_name").replace('.jsonl', '');
    characters_array[active_character_index]['chat'] = file_name;
    clearChat();
    chat_mess_content.length = 0;
    getChat();
    $('#selected_chat_pole').val(file_name);
    $("#create_button").click();
    $('#shadow_select_chat_popup').addClass('generic_hidden')
    $('#load_select_chat_div').removeClass('generic_hidden')

});

//**************************CHAR SEARCH BAR*************************//
document.getElementsByName("char_search")[0].addEventListener('keyup', trim_chars);
function trim_chars(){
    var check =  document.getElementById('char_search').value
        const character_list = document.querySelector('#rm_print_charaters_block').querySelectorAll('div.character_select');
        for (let i = 0; i < character_list.length; i++) {
            if (character_list[i].textContent.toLowerCase().indexOf(this.value)<0){
                character_list[i].classList.add('generic_hidden');
            }
            else{
                character_list[i].classList.remove('generic_hidden');
            }
    }
}

function auto_start(){
    document.querySelectorAll('.api_button')[0].click()
}

function auto_open(){
    if (open_nav_bar){
        document.getElementById("logo_block").click()
    }
    if (open_bg_bar){
    document.getElementById('right_menu-toggle').click()
    }
};
function auto_last_menu(){
        if (last_menu == "char_list"){
            document.getElementById("rm_button_characters").click()
        }
        else if (last_menu == "sett"){
            document.getElementById("rm_button_settings").click()
        }
        else if (last_menu == "last_char" && settings.last_char != undefined){
            document.getElementById("rm_button_selected_ch").click()
        }
        else{
            document.getElementById("rm_button_characters").click()
        }
    }
;
async function auto_char(){
    if (open_last_char == false && settings.last_char == undefined){
        auto_last_menu()
        return
    }
    const parentDiv = document.querySelector('#rm_print_charaters_block');
    const characters = parentDiv.querySelectorAll('div.character_select');
    const last_char_match = last_char
    for (let i = 0; i < characters.length; i++) {
        var avatar = characters[i].querySelector('div.avatar').querySelector('img').getAttribute('src').replace(/#.*/, "")
        if (avatar == last_char_match){
            characters[i].click()
            await new Promise(resolve => setTimeout(resolve, 250));
            auto_last_menu()
            break
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function BG_shuffle(){
    const parentDiv = document.querySelector('#bg_menu_content');
    const BGs = parentDiv.querySelectorAll('img.bg_example_img');
    while (true) {
        if (bg_shuffle_delay <= 59000) {
            await new Promise(resolve => setTimeout(resolve, bg_shuffle_delay));
        }
        else{
            await new Promise(resolve => setTimeout(resolve, bg_shuffle_delay));
            var rng = getRandomInt(Math.floor(Math.random() * BGs.length))
            //console.log(BGs)
            BGs[rng].click();
        }
    }
}


$(document).ready(function() {
    setTimeout(auto_start, 700)
    setTimeout(auto_open, 700)
    setTimeout(auto_char, 1000)
    setTimeout(BG_shuffle, 700)
})
$("#api_settings").click(function () {
        $("#API_sett_block").css("display", 'block');
        $("#sys_sett_block").css("display", 'none');
        $("#api_settings").children("h2").addClass('selected_button')
        $("#system_settings").children("h2").removeClass('selected_button')
        //assignments are handled elsewhere in legacy so theres none here
        build_main_system_message()
    }
);
$("#system_settings").click(function () {
    $("#sys_sett_block").css("display", 'block');
    $("#API_sett_block").css("display", 'none');
    $("#system_settings").children("h2").addClass('selected_button')
    $("#api_settings").children("h2").removeClass('selected_button')
        //default is system so we populate those fields
        var display_var =  msToTime(settings.bg_shuffle_delay)
        document.getElementById("bg_shuffle_val_display").textContent = `${display_var}`
        document.getElementById("bg_shuffle_time").value = settings.bg_shuffle_delay
        //bookmark
        $('#open_last_char_togg').prop('checked', open_last_char);
        $('#open_sett_start').prop('checked', open_nav_bar);
        $('#open_bg_start').prop('checked', open_bg_bar);
        var menu = document.getElementById('menu_sel_box');
        for (var i = 0; i < menu.options.length; i++) {
            if (menu.options[i].value === last_menu) {
                menu.selectedIndex = i;
                break;
            }
        } 

}
);
$("#sys_sel_box").change(function() {
    var menu = document.getElementById('sys_sel_box');
    var selectedValue = menu.options[menu.selectedIndex].value;
    var block = document.getElementById("system_sett_options");
    for (var i=0; i<block.children.length; i++) {
        block.children[i].style.display = 'none';
        if (block.children[i].getAttribute('id') == selectedValue) {
            block.children[i].style.display = 'block';
        } 
    }
});

$("#menu_sel_box").change(function() {
    var menu = document.getElementById('menu_sel_box');
    last_menu = menu.options[menu.selectedIndex].value;
    saveSettings();
});

function msToTime(duration) {
    if (duration == 59000){
        return "Disabled"
    }
    var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + " H " + minutes + " M " + seconds + " S";
}
//i hate this
$("#bg_shuffle_time").change(function () {
    bg_shuffle_delay = document.getElementById("bg_shuffle_time").value
    var display_var =  msToTime(bg_shuffle_delay)
    document.getElementById("bg_shuffle_val_display").textContent = `${display_var}`
    saveSettings();
}
)

//learned about debouce 
//not implementing it for now (tm)
function prompt_flag_save(){
    raise_save_flag()
    clearTimeout(timerSaveEdit);
    timerSaveEdit = setTimeout(() => {
            saveSettings();
            build_main_system_message(); }, durationSaveEdit);
}

$("#system_prompt_button").click(function () {
    if (document.getElementById("sys_prompt_block").style.display == "none"){
        $("#sys_prompt_block").css("display", 'block');
        $("#system_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#sys_prompt_block").css("display", 'none');
        $("#system_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#NSFW_prompt_button").click(function () {
    if (document.getElementById("NSFW_prompt_block").style.display == "none"){
        $("#NSFW_prompt_block").css("display", 'block');
        $("#NSFW_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#NSFW_prompt_block").css("display", 'none');
        $("#NSFW_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#CYOA_prompt_button").click(function () {
    if (document.getElementById("CYOA_prompt_block").style.display == "none"){
        $("#CYOA_prompt_block").css("display", 'block');
        $("#CYOA_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#CYOA_prompt_block").css("display", 'none');
        $("#CYOA_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#CUST_1_prompt_button").click(function () {
        if (document.getElementById("CUST_1_block").style.display == "none"){
            $("#CUST_1_block").css("display", 'block');
            $("#CUST_1_prompt_button").children("h2").addClass('selected_button')
        } 
        else{
            $("#CUST_1_block").css("display", 'none');
            $("#CUST_1_prompt_button").children("h2").removeClass('selected_button')
        }});
$("#CUST_2_prompt_button").click(function () {
    if (document.getElementById("CUST_2_block").style.display == "none"){
        $("#CUST_2_block").css("display", 'block');
        $("#CUST_2_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#CUST_2_block").css("display", 'none');
        $("#CUST_2_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#CUST_3_prompt_button").click(function () {
    if (document.getElementById("CUST_3_block").style.display == "none"){
        $("#CUST_3_block").css("display", 'block');
        $("#CUST_3_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#CUST_3_block").css("display", 'none');
        $("#CUST_3_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#CUST_4_prompt_button").click(function () {
    if (document.getElementById("CUST_4_block").style.display == "none"){
        $("#CUST_4_block").css("display", 'block');
        $("#CUST_4_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#CUST_4_block").css("display", 'none');
        $("#CUST_4_prompt_button").children("h2").removeClass('selected_button')
    }});
$("#CUST_5_prompt_button").click(function () {
    if (document.getElementById("CUST_5_block").style.display == "none"){
        $("#CUST_5_block").css("display", 'block');
        $("#CUST_5_prompt_button").children("h2").addClass('selected_button')
    } 
    else{
        $("#CUST_5_block").css("display", 'none');
        $("#CUST_5_prompt_button").children("h2").removeClass('selected_button')
    }});
$('#system_prompt').on('keyup paste cut', function () {
        system_prompt = document.getElementById("system_prompt").value
    prompt_flag_save()
    }
);
$('#desc_prompt').on('keyup paste cut', function () {
    description_prompt = document.getElementById("desc_prompt").value
    prompt_flag_save()
    }
);
$('#personality_prompt').on('keyup paste cut', function () {
    personality_prompt = document.getElementById("personality_prompt").value
    prompt_flag_save()
    }
);
$('#scenario_prompt').on('keyup paste cut', function () {
    scenario_prompt = document.getElementById("scenario_prompt").value
    prompt_flag_save()
    }
);

$('#NSFW_ON_prompt').on('keyup paste cut', function () {
    NSFW_on_prompt = document.getElementById("NSFW_ON_prompt").value
    prompt_flag_save()
    }
);

$('#NSFW_OFF_prompt').on('keyup paste cut', function () {
    NSFW_off_prompt = document.getElementById("NSFW_OFF_prompt").value
    prompt_flag_save()
    }
);

$('#CYOA_prompt').on('keyup paste cut', function () {
    CYOA_prompt = document.getElementById("CYOA_prompt").value
    prompt_flag_save()
    }
);

$('#CUST_1_title').on('keyup paste cut', function () {
    custom_1_title = document.getElementById("CUST_1_title").value
    prompt_flag_save()
    }
);

$('#CUST_1_description').on('keyup paste cut', function () {
    custom_1_desc = document.getElementById("CUST_1_description").value
    prompt_flag_save()
    }
);

$('#CUST_1_Prompt').on('keyup paste cut', function () {
    custom_1_prompt = document.getElementById("CUST_1_Prompt").value
    prompt_flag_save()
    }
);

$('#CUST_2_title').on('keyup paste cut', function () {
    custom_2_title = document.getElementById("CUST_2_title").value
    prompt_flag_save()
    }
);

$('#CUST_2_description').on('keyup paste cut', function () {
    custom_2_desc = document.getElementById("CUST_2_description").value
    prompt_flag_save()
    }
);

$('#CUST_2_Prompt').on('keyup paste cut', function () {
    custom_2_prompt = document.getElementById("CUST_2_Prompt").value
    prompt_flag_save()
    }
);

$('#CUST_3_title').on('keyup paste cut', function () {
    custom_3_title = document.getElementById("CUST_3_title").value
    prompt_flag_save()
    }
);

$('#CUST_3_description').on('keyup paste cut', function () {
    custom_3_desc = document.getElementById("CUST_3_description").value
    prompt_flag_save()
    }
);

$('#CUST_3_Prompt').on('keyup paste cut', function () {
    custom_3_prompt = document.getElementById("CUST_3_Prompt").value
    prompt_flag_save()
    }
);

$('#CUST_4_title').on('keyup paste cut', function () {
    custom_4_title = document.getElementById("CUST_4_title").value
    prompt_flag_save()
    }
);

$('#CUST_4_description').on('keyup paste cut', function () {
    custom_4_desc = document.getElementById("CUST_4_description").value
    prompt_flag_save()
    }
);

$('#CUST_4_Prompt').on('keyup paste cut', function () {
    custom_4_prompt = document.getElementById("CUST_4_Prompt").value
    prompt_flag_save()
    }
);

$('#CUST_5_title').on('keyup paste cut', function () {
    custom_5_title = document.getElementById("CUST_5_title").value
    prompt_flag_save()
    }
);

$('#CUST_5_description').on('keyup paste cut', function () {
    custom_5_desc = document.getElementById("CUST_5_description").value
    prompt_flag_save()
    }
);

$('#CUST_5_Prompt').on('keyup paste cut', function () {
    custom_5_prompt = document.getElementById("CUST_5_Prompt").value
    prompt_flag_save()
    }
);

$("#desc_butt").click(function () {
    let div = document.getElementById('description_div');
    let button = document.getElementById('desc_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$("#first_mes_butt").click(function () {
    let div = document.getElementById('first_message_div');
    let button = document.getElementById('first_mes_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$("#pers_butt").click(function () {
    let div = document.getElementById('personality_div');
    let button = document.getElementById('pers_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$("#scen_butt").click(function () {
    let div = document.getElementById('scenario_div');
    let button = document.getElementById('scen_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$("#ex_dialog_butt").click(function () {
    let div = document.getElementById('mes_example_div');
    let button = document.getElementById('ex_dialog_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$("#name_butt").click(function () {
    let div = document.getElementById('name_avatar_div');
    let button = document.getElementById('name_butt');
    let is_open = div.classList.contains('generic_hidden');
    if (is_open){
        div.classList.remove('generic_hidden');
        button.classList.add('selected_button')
    }
    else{
        div.classList.add('generic_hidden');
        button.classList.remove('selected_button')
    }
});
$('#auto_retry').change(function () {
    auto_retry = !!$('#auto_retry').prop('checked');
    saveSettings();
});
$('#continuous_mode').change(function () {
    continuous_mode = !!$('#continuous_mode').prop('checked');
    saveSettings();
});
$('#right_menu-toggle').change(function () {
    let target = document.getElementById('right_menu')
    var is_open = target.classList.contains('rm_hidden');
    var main_chat = document.getElementById('main_chat')
    if (is_open){
        target.classList.remove('rm_hidden')
        main_chat.classList.add('right_open');
    }
    else{
        target.classList.add('rm_hidden');
        main_chat.classList.remove('right_open');
    }
})
function update_real_cost(error) {
    if (error){
        document.getElementById('cost_spent').value = `something borked during message gen`
        return
    }
    //weird formattting is a req because its in a format block, acts as \n but more readable
    document.getElementById('cost_spent').value = `Actual $${((last_got_gen_tokens*prompt_price_per1k)+(last_sent_cntn_tokens*reply_price_per1k))}
(${last_sent_cntn_tokens} context tokens with ${last_got_gen_tokens} reply tokens, total: ${last_sent_cntn_tokens+last_got_gen_tokens})`
}