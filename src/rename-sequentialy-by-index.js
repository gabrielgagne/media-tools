const fs = require('fs-extra');
const path = require('path');
const renameSequentiallyByIndex = async (folderPath) => {
  const allFiles = fs.readdirSync(folderPath, { withFileTypes: true }).filter(f => !f.isDirectory());
  const filesWithExtension = ArrayOfTitles.map(t => `${t}.mp4`.replaceAll(':', '').replaceAll('*', ''));
  for(const file of allFiles) {

    const index = filesWithExtension.findIndex(f => f === file.name);
    const oldName = path.join(folderPath, file.name);
    const newName = path.join(folderPath, `${index} ${file.name}`);
    if(index !== -1) {
      fs.renameSync(oldName, newName);
    } else {
      console.log(oldName);
    }
  }

}


// run in playlist page: [...document.querySelectorAll('.ytd-playlist-video-renderer h3 a.yt-simple-endpoint')].map(n => n.textContent.replace('\n', '').trim()).reverse(), 
// right click result, copy object and paste here 
const ArrayOfTitles = [
  "Tremors - re:View",
  "Escape from New York - re:View",
  "Independence Day (1996) - re:View",
  "Eraserhead - re:View",
  "Ghostbusters (1984) - re:View",
  "Mad Max 2: The Road Warrior - re:View",
  "The Blair Witch Project - re:View",
  "Blade - re:View",
  "The Gate - re:View",
  "Dawn of the Dead - re:View",
  "Land of the Dead and The Social Commentary of George Romero - re:View",
  "True Stories - re:View",
  "Starship Troopers re:View",
  "Horse Ninja - re:View",
  "Demolition Man - re:View",
  "The Mist - re:View",
  "Twin Peaks: Fire Walk With Me - re:View",
  "Blade Runner - re:View",
  "George A. Romero's Martin - re:View",
  "Blind Fury - re:View",
  "Joe Versus the Volcano - re:View",
  "Star Trek Discovery (Pilot Episodes) - re:View",
  "Re-Animator and From Beyond - re:View",
  "Nothing But Trouble - re:View",
  "Ed Wood - re:View",
  "Star Trek Discovery mid-season - re:View",
  "Pink Flamingos - re:View",
  "Star Trek Discovery Season 1 - re:View",
  "Freddy Got Fingered - re:View",
  "The Guest - re:View",
  "Critters - re:View",
  "John Carpenter's The Thing - re:View",
  "Strange Brew - re:View",
  "Predator - re:View",
  "Star Trek: Galaxy - re:View",
  "The Psycho Franchise - re:View (part 1 of 2)",
  "The Psycho Franchise - reView (part 2 of 2)",
  "Hackers - reView",
  "Star Trek: The Motion Picture - re:View",
  "Short Treks - re:View",
  "Return of the Living Dead - re:View",
  "Top Secret - re:View",
  "Suspiria (1977) - re:View",
  "Suspiria (re:Make) - re:View",
  "The Rocketeer - re:View",
  "The Warriors - re:View",
  "Star Trek Discovery Season 2 - re:View",
  "In the Mouth of Madness - re:View",
  "Bone Tomahawk - re:View",
  "Gremlins 2: The New Batch - re:View",
  "The Exorcist - re:View",
  "Exorcist III - re:View",
  "The Last Dragon - re:View",
  "The Mandalorian - re:View",
  "Tron and Tron: Legacy - re:View",
  "Star Trek: Picard - re:View",
  "Star Trek: Picard Episodes 2 and 3 - re:View",
  "Star Trek: Picard Episodes 4 and 5 - re:View",
  "Star Trek: Picard Episodes 6,7, and 8 - re:View",
  "Cabin Fever - re:View",
  "Freaked - re:View",
  "Willy Wonka and the Chocolate Factory - re:View",
  "UHF - re:View",
  "Mike and Rich's Top 5 Star Trek TNG Episodes! - re:View (part 1)",
  "Mike and Rich's Top 5 Star Trek TNG Episodes! - re:View (part 2)",
  "Bill and Ted's Excellent Adventure & Bogus Journey - re:View",
  "Friday the 13th Sequels - re:View",
  "More Rich and Mike's Top Ten TNG Episodes - re:View",
  "More Friday the 13th Sequel Talk - re:View",
  "Rich and Mike's Second TNG Top Ten Video part 2 (of 2) - re:View",
  "Twin Peaks: The Return - re:View (Part 1)",
  "Twin Peaks: The Return - re:View (Part 2)",
  "The Blob (1988) - re:View",
  "Re:View - Star Trek The Next Generation Season One",
  "Event Horizon - re:View",
  "Spacehunter: Adventures in the Forbidden Zone - re:View",
  "Bram Stoker's Dracula - re:View",
  "Our Least Viewed Episode Ever",
  "Ice Pirates - re:View",
  "Ranking Every John Carpenter Movie (part 1 of 3) - re:View",
  "Ranking Every John Carpenter Movie (part 2 of 3) - re:View",
  "Ranking Every John Carpenter Movie (part 3 of 3) - re:View",
  "Enemy Mine - re:View",
  "Dune (1984) and Dune (2021) - re:View",
  "Blood Beat - re:View",
  "Total Recall - re:View",
  "Near Dark - re:View",
  "Star Trek: Picard Season 2, Episode 1 - re:View",
  "Star Trek: Picard Season 2, Episodes 2 and 3 - re:View",
  "Darkman - re:View",
  "Star Trek: Picard Season 2, Episodes 4 and 5 - re:View",
  "Star Trek: Picard Season 2, Episodes 6, 7, 8, and 9 - re:View",
  "Star Trek: Picard Season 2, Episode 10 - re:View",
  "Obi-Wan Kenobi: Episodes 1-4 - re:View",
  "Who Framed Roger Rabbit - re:View"
];
module.exports = { renameSequentiallyByIndex }