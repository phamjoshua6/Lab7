describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });
    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    let allArePopulated = true;

    const prodItemsData = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map((item) => {
        const data = item.data;
        return {
          title: data.title,
          price: data.price,
          image: data.image
        };
      });
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const item = prodItemsData[i];
      if (!item.title || !item.price || !item.image) {
        allArePopulated = false;
      }
    }

    expect(allArePopulated).toBe(true);
  }, 10000);


    /**
     **** TODO - STEP 2 **** 
     * Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
     * Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
     * Once you have the button, you can click it and check the innerText property of the button.
     * Once you have the innerText property, use innerText.jsonValue() to get the text value of it
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    
    const prodItem = await page.$('product-item');
    const shadowRoot = await prodItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    
    await button.click();
    
    const buttonText = await (await button.getProperty('innerText')).jsonValue();
    expect(buttonText).toBe('Remove from Cart');
  }, 2500);


    /**
     **** TODO - STEP 3 **** 
     * Query select all of the <product-item> elements, then for every single product element
       get the shadowRoot and query select the button inside, and click on it.
     * Check to see if the innerText of #cart-count is 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
      
    const prodItems = await page.$$('product-item');
      
    for (let item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await (await button.getProperty('innerText')).jsonValue();
      if (buttonText === 'Add to Cart') {
        await button.click();
        await new Promise((r) => setTimeout(r, 100));

      }
    }
      
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 20000);


    /**
     **** TODO - STEP 4 **** 
     * Reload the page, then select all of the <product-item> elements, and check every
       element to make sure that all of their buttons say "Remove from Cart".
     * Also check to make sure that #cart-count is still 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
      
    await page.reload();
      
    const prodItems = await page.$$('product-item');
      
    for (let item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await (await button.getProperty('innerText')).jsonValue();
      expect(buttonText).toBe('Remove from Cart');
    }
      
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 40000);

    /**
     **** TODO - STEP 5 **** 
     * At this point the item 'cart' in localStorage should be 
       '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
      
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
      
  });


    /**
     **** TODO - STEP 6 **** 
     * Go through and click "Remove from Cart" on every single <product-item>, just like above.
     * Once you have, check to make sure that #cart-count is now 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Removing all items from cart...');
    
    const prodItems = await page.$$('product-item');
    
    for (let item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
    
      let buttonText = await (await button.getProperty('innerText')).jsonValue();
    
        // Keep clicking until the button says "Add to Cart"
      while (buttonText !== 'Add to Cart') {
        await button.click();
        await new Promise((r) => setTimeout(r, 100));
        buttonText = await (await button.getProperty('innerText')).jsonValue();
      }
    }
    
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 20000);


    /**
     **** TODO - STEP 7 **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Reloading page and checking cart is empty...');
      
    await page.reload();
      
    const prodItems = await page.$$('product-item');
      
    for (let item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await (await button.getProperty('innerText')).jsonValue();
      expect(buttonText).toBe('Add to Cart');
    }
      
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    
    expect(cart).toBe('[]');
  });
});