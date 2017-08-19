## Responsive Slider

Responsive Slider is javascript plugin to show images as a slider and it's get data from json file.

steps to run a project

step1: create div with id  like this <div id="slider"></div>
step2: update javascript script
var slider = new ResponsiveSlider.Slider({id of div slider},{url of json and {step} syntax for counter});

for example
url -> https://xx/ajax/search?page=1
var slider = new ResponsiveSlider.Slider({id of div slider},'https://xxxx/ajax/search?page={step}');