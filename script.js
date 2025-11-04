if (typeof gsap === "undefined") {
  console.error("GSAP not loaded. Ensure gsap.min.js is included before script.js");
} else {
  // Register ScrollTrigger plugin (plugin script must be loaded in HTML)
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn("ScrollTrigger not found. Scroll-triggered animations will be skipped.");
  }

  const slideData = [
    {
      title: "Red Roses",
      text: "For the perfect start of love.",
      image: "images/roses.png"
    },
    {
      title: "Elegant Lilies",
      text: "Symbolizing purity and beauty.",
      image: "images/lily.png"
    },
    {
      title: "Sun-Kissed Tulips",
      text: "Bringing spring cheer to any home.",
      image: "images/tulips.png"
    },
    {
      title: "Custom Creations",
      text: "Design your dream bouquet today.",
      image: "images/custom.png"
    }
  ];

  const track = document.querySelector('.carousel-slide-track');
  const container = document.querySelector('.carousel-container');

  if (!track || !container) {
    console.error('Missing .carousel-slide-track or .carousel-container in DOM.');
  } else {
    const numSlides = slideData.length;

    // expose num slides to CSS (keeps CSS/CSS-vars in sync)
    container.style.setProperty('--num-slides', numSlides);

    // Generate slides HTML
    const slidesHTML = slideData.map((slide, index) => `
              <div class="carousel-slide" data-slide="${index}" style="background-image: url('${slide.image}');">
                  <div class="heading">
                      <h2 class="bold">${slide.title}</h2>
                      <p>${slide.text}</p>
                  </div>
              </div>
          `).join('');

    track.innerHTML = slidesHTML;
    // Each slide is 100vw, so track width = numSlides * 100vw
    track.style.width = `${numSlides * 100}vw`;

    // ========================================
    // 🎬 ANIMATION FUNCTION
    // ========================================
    function animateSlideText(slideIndex) {
      const slide = document.querySelector(`[data-slide="${slideIndex}"]`);
      if (!slide) return;
      const h2 = slide.querySelector('h2');
      const p = slide.querySelector('p');

      if (h2) {
        gsap.fromTo(h2, { opacity: 0, y: 50, scale: 0.8 }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15
        });
      }
      if (p) {
        gsap.fromTo(p, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.45
        });
      }
    }

    // Create infinite timeline for carousel
    const carouselTimeline = gsap.timeline({
      repeat: -1
    });

    // Animate first slide immediately
    animateSlideText(0);

    // Make sure we start at position 0
    carouselTimeline.set(track, { xPercent: 0 }, 0);

    // Dynamic movement values
    const percentPerSlide = 100 / numSlides; // e.g., 25 for 4 slides
    const holdTime = 3; // seconds each slide stays visible before moving
    const moveDuration = 1; // duration of slide move

    // Build timeline: for each next slide, schedule move at i * holdTime
    for (let i = 1; i < numSlides; i++) {
      const atTime = i * holdTime;
      carouselTimeline.to(track, {
        xPercent: -(percentPerSlide * i),
        duration: moveDuration,
        ease: "power2.inOut",
        onComplete: () => animateSlideText(i)
      }, atTime);
    }

    // Reset to first slide after full cycle
    const totalCycle = numSlides * holdTime;
    carouselTimeline.set(track, { xPercent: 0 }, totalCycle);
    carouselTimeline.call(() => animateSlideText(0), null, totalCycle);

    // Add padding time before repeat (show slide 1 for holdTime seconds)
    carouselTimeline.to({}, { duration: holdTime }, totalCycle);
  }

  // ========================================
  // Trending Section Animation (guarded)
  // ========================================
  const trendingSection = document.getElementById('trending');
  const cardTrack = document.querySelector('.trending-card-track');
  const cardData = [
    { title: "Romantic Roses", image: "images/trending1.png" },
    { title: "Sunny Daisies", image: "images/trending2.png" },
    { title: "Vibrant Tulips", image: "images/trending3.png" },
    { title: "Elegant Orchids", image: "images/trending4.png" },
    { title: "Colorful Mixed Bouquet", image: "images/trending5.png" }
  ];

  if (trendingSection && typeof ScrollTrigger !== "undefined") {
    gsap.from(trendingSection, {
      scrollTrigger: {
        trigger: trendingSection,
        start: "top 60%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power3.out"
    });
  }

  if (cardTrack) {
    const cardsHTML = cardData.map(card => `
      <div class="trending-card" style="background-image: url('${card.image}');">
          <h2 class="trending-card-title bold">${card.title}</h2>
      </div>
    `).join('');
    cardTrack.innerHTML = cardsHTML;

    if (typeof ScrollTrigger !== "undefined") {
      gsap.from(".trending-card", {
        scrollTrigger: {
          trigger: trendingSection || cardTrack,
          start: "top 60%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.3
      });

      gsap.from("#trending h2", {
        scrollTrigger: {
          trigger: trendingSection,
          start: "top 60%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      });
    }
  }

  // ========================================
  // Product Showcase Section
  // ========================================
  const flowerData = [
    { id: 101, name: "Pink Roses", price: 45.00, image: "images/custom.png", alt: "Pink Roses" },
    { id: 102, name: "Sunflowers", price: 38.00, image: "https://images.unsplash.com/photo-1517258024599-26a5048d0949?w=400&h=500&fit=crop", alt: "Sunflowers" },
    { id: 103, name: "Spring Tulips", price: 42.00, image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&h=500&fit=crop", alt: "Tulips" },
    { id: 104, name: "White Lilies", price: 50.00, image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400&h=500&fit=crop", alt: "Lilies" },
    { id: 105, name: "Orchids", price: 65.00, image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=500&fit=crop", alt: "Orchids" },
    { id: 106, name: "Peonies", price: 55.00, image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=500&fit=crop", alt: "Peonies" }
  ];

  let cart = []; // 🛒 Initialize the Cart Array

  const productContainer = document.getElementById('horizontal-scroll-container');
  if (productContainer) {
    const productCardsHTML = flowerData.map(flower => `
              <div class="flower-card" data-product-id="${flower.id}">
                  <img src="${flower.image}" alt="${flower.alt}" class="flower-image">
                  <div class="flower-info">
                      <div class="flower-name">${flower.name}</div>
                      <div class="flower-price">
                          <span>$${flower.price.toFixed(2)}</span>
                          <button class="add-to-cart-btn" data-product-id="${flower.id}">Add to Cart</button>
                      </div>
                  </div>
              </div>
          `).join('');

    productContainer.innerHTML = productCardsHTML;

    // Add to cart handling
    function addToCart(productId) {
      const product = flowerData.find(p => p.id === parseInt(productId));
      if (!product) return;

      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      console.log(`Added ${product.name} to cart. Current cart:`, cart);
      // Keep UX simple — use a non-blocking notification mechanism in future
      alert(`${product.name} added to cart! Total items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`);
    }

    productContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.add-to-cart-btn');
      if (button) {
        const productId = button.dataset.productId;
        addToCart(productId);
      }
    });

    // GSAP horizontal scroll animations (only if ScrollTrigger available)
    if (typeof ScrollTrigger !== "undefined") {
      const horizontalSection = document.getElementById("horizontal-scroll-container");
      const flowerCards = gsap.utils.toArray(".flower-card");

      // recalc after DOM injection and next paint
      requestAnimationFrame(() => {
        const totalScrollWidth = horizontalSection.scrollWidth - window.innerWidth;

        const horizontalScrollTween = gsap.to(horizontalSection, {
          x: -totalScrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: "#product-section",
            start: "top top",
            end: `+=${totalScrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        flowerCards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "left 95%",
              containerAnimation: horizontalScrollTween,
              toggleActions: "play none none none",
            }
          });
        });
      });
    }
  } // end productContainer guard
}