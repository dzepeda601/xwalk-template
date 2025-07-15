import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    
    // Move all children from the row to the li
    while (row.firstElementChild) li.append(row.firstElementChild);
    
    // Apply class names to each child div
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    
    // Check for link and wrap the content inside the <li> with <a> if needed
    const link = li.querySelector('a');
    if (link) {
      const href = link.href;
      
      // Create the <a> element and set the href
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.setAttribute('aria-label', link.textContent); // Optional, for accessibility
      
      // Move all children of li into the anchor tag
      while (li.firstChild) {
        anchor.appendChild(li.firstChild);
      }
      
      // Replace the content of li with the anchor
      li.appendChild(anchor);
      link.parentElement.parentElement.remove();
    }

    // Process images inside <li> and optimize them
    li.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    });

    ul.append(li);
  });

  // Clear the block and append the new list
  block.textContent = '';
  block.append(ul);
}
