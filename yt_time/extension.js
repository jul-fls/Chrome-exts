function parseTabs(tabs) {
     titles = [];
     for (var i = 0; i < tabs.length; i++) {
         titles.push(tabs[i].title)+"\n";
     }
     //on each tab that is a yt video, add to array
     yt_videos = [];
     for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].title.includes("YouTube")) {
               yt_videos.push(tabs[i]);
          }
     }
     videos_time = 0;
     for(var i = 0; i < tabs.length; i++) {
          //execute script on each tab to get video length
          if(tabs[i].url.includes("youtube.com")) {
               chrome.scripting.executeScript({
                    target: {tabId: tabs[i].id},
                    function: function() {
               //           return document.querySelector('video').duration;
                    }
               }, function(result) {
                    videos_time += result;
               });
          }
          // tabs.executeScript(tabs[i].id, {code: "document.querySelector('video').duration"}, function(result) {
          //      videos_time += result;
          // });
     }
     video_time_string = "";
     //convert secondes to hh:mm:ss
     hours = Math.floor(videos_time / 3600);
     minutes = Math.floor((videos_time - (hours * 3600)) / 60);
     seconds = videos_time - (hours * 3600) - (minutes * 60);
     if (hours < 10) {video_time_string += "0";} 
     video_time_string += hours + ":";
     if (minutes < 10) {video_time_string += "0";}
     video_time_string += minutes + ":";
     if (seconds < 10) {video_time_string += "0";}
     video_time_string += seconds;
     document.querySelector("p").innerHTML=videos_time;
}
chrome.tabs.query({}, function(tabs) {
     parseTabs(tabs);
     // document.querySelector("p").innerHTML=titles
});
// chrome.browserAction.onClicked.addListener(function() { 
//     document.querySelector("p").innerHTML='Hello, World!'; 
// });