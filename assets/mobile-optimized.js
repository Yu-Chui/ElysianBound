/**
 * 移动设备优化脚本
 * 处理移动设备特有的功能和优化
 */

// 检测触摸设备
// 使用更简单的检测方式，避免TypeScript类型错误
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 优化移动设备滚动体验
function optimizeScrolling() {
  // 启用平滑滚动
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // 优化滚动惯性
  if (isTouchDevice) {
    // 使用setProperty方法来设置非标准CSS属性
    document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
  }
  
  // 注意：移除了全局的touchstart事件监听器，避免阻止标头点击
  // 这样可以确保所有的触摸点击都能正常工作
}

// 实现触摸手势支持
function enableTouchGestures() {
  if (!isTouchDevice) return;
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', function(e) {
    const touches = e.changedTouches;
    if (touches && touches.length > 0) {
      const firstTouch = touches[0];
      if (firstTouch) {
        touchStartX = firstTouch.screenX;
        touchStartY = firstTouch.screenY;
      }
    }
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    const touches = e.changedTouches;
    if (touches && touches.length > 0) {
      const firstTouch = touches[0];
      if (firstTouch) {
        touchEndX = firstTouch.screenX;
        touchEndY = firstTouch.screenY;
        handleSwipe();
      }
    }
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // 水平滑动
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > swipeThreshold) {
        // 向右滑动
        handleSwipeRight();
      } else if (diffX < -swipeThreshold) {
        // 向左滑动
        handleSwipeLeft();
      }
    } else {
      // 垂直滑动
      if (diffY > swipeThreshold) {
        // 向下滑动
        handleSwipeDown();
      } else if (diffY < -swipeThreshold) {
        // 向上滑动
        handleSwipeUp();
      }
    }
  }
  
  function handleSwipeLeft() {
    // 向左滑动逻辑
    const nextButton = document.querySelector('.slideshow__arrow--next');
    if (nextButton) {
      // @ts-ignore - 忽略类型检查错误
      nextButton.click();
    }
  }
  
  function handleSwipeRight() {
    // 向右滑动逻辑
    const prevButton = document.querySelector('.slideshow__arrow--prev');
    if (prevButton) {
      // @ts-ignore - 忽略类型检查错误
      prevButton.click();
    }
  }
  
  function handleSwipeUp() {
    // 向上滑动逻辑
  }
  
  function handleSwipeDown() {
    // 向下滑动逻辑
    // 可以实现下拉刷新
  }
}

// 优化图片加载
function optimizeImageLoading() {
  // 延迟加载图片
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const element = entry.target;
          // 确保元素是图片元素
          if (element instanceof HTMLImageElement) {
            // 安全地访问dataset属性
            const src = element.getAttribute('data-src');
            if (src) {
              element.src = src;
              element.classList.remove('lazy');
              imageObserver.unobserve(element);
            }
          }
        }
      });
    });
    
    lazyImages.forEach(function(image) {
      imageObserver.observe(image);
    });
  } else {
    // 降级方案
    lazyImages.forEach(function(element) {
      // 确保元素是图片元素
      if (element instanceof HTMLImageElement) {
        const src = element.getAttribute('data-src');
        if (src) {
          element.src = src;
          element.classList.remove('lazy');
        }
      }
    });
  }
  
  // 为移动设备提供更小的图片
  const images = document.querySelectorAll('img');
  images.forEach(function(element) {
    // 确保元素是图片元素
    if (element instanceof HTMLImageElement) {
      if (element.srcset) {
        return;
      }
      
      const src = element.src;
      const mobileSrc = src.replace(/(\.[^.]+)$/, '-mobile$1');
      
      // 检查移动设备图片是否存在
      const testImage = new Image();
      testImage.onload = function() {
        element.src = mobileSrc;
      };
      testImage.onerror = function() {
        // 移动设备图片不存在，使用原始图片
      };
      testImage.src = mobileSrc;
    }
  });
}

// 优化表单输入
function optimizeFormInputs() {
  // 禁用自动缩放
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport instanceof HTMLMetaElement) {
    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  }
  
  // 优化输入框焦点
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(function(input) {
    input.addEventListener('focus', function() {
      // 滚动到输入框位置
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

// 处理菜单点击事件
function handleMenuClick(event) {
  // 防止事件冒泡
  event.stopPropagation();
  event.preventDefault();
  
  console.log('菜单按钮被点击');
  
  // 尝试多种选择器来找到菜单容器
  const selectors = [
    '#Details-menu-drawer-container',
    '.menu-drawer__container',
    '[data-menu-drawer]'
  ];
  
  let details = null;
  for (const selector of selectors) {
    details = document.querySelector(selector);
    if (details) {
      console.log('找到菜单容器:', selector);
      break;
    }
  }
  
  // 处理菜单状态切换
  let menuOpen = false;
  if (details) {
    console.log('切换菜单状态');
    // 使用更可靠的方法来切换菜单状态
    if (details.hasAttribute('open')) {
      console.log('关闭菜单');
      details.removeAttribute('open');
      menuOpen = false;
    } else {
      console.log('打开菜单');
      details.setAttribute('open', 'open');
      menuOpen = true;
    }
  } else {
    console.log('未找到菜单容器');
    // 尝试直接切换菜单抽屉的显示/隐藏
    const menuDrawer = document.querySelector('.menu-drawer');
    if (menuDrawer) {
      console.log('直接操作菜单抽屉');
      if (menuDrawer.style.display === 'none' || menuDrawer.style.display === '') {
        menuDrawer.style.display = 'block';
        menuOpen = true;
      } else {
        menuDrawer.style.display = 'none';
        menuOpen = false;
      }
    }
  }
  
  // 确保菜单栏的z-index高于标头
  const menuDrawer = document.querySelector('.menu-drawer');
  if (menuDrawer) {
    menuDrawer.style.zIndex = '9999 !important'; // 使用!important确保样式不会被覆盖
    menuDrawer.style.display = 'block !important'; // 确保菜单栏显示
    console.log('设置菜单栏z-index为9999');
    
    // 同时确保菜单栏内的所有元素z-index高于标头
    const menuChildren = menuDrawer.querySelectorAll('*');
    menuChildren.forEach(function(child) {
      child.style.zIndex = '9999 !important'; // 使用!important确保样式不会被覆盖
    });
  }
  
  // 检查菜单的实际状态，确保样式调整正确
  console.log('菜单状态:', menuOpen ? '打开' : '关闭');
  console.log('菜单栏元素:', menuDrawer);
}

// 静态调整Products标题位置
function adjustProductsHeadingPosition() {
  // 检测是否为移动设备
  if (window.innerWidth <= 768) {
    console.log('检测到移动设备，调整Products标题位置');
    
    // 查找Products标题元素
    const productsHeadings = document.querySelectorAll('h1, h2, h3');
    productsHeadings.forEach(function(heading) {
      if (heading && heading.textContent && heading.textContent.includes('Products')) {
        console.log('找到Products标题，开始调整位置:', heading);
        
        // 设置固定的顶部边距，确保Products标题显示在标头下方
        const headerHeight = 60; // header的高度
        const fixedMarginTop =  20; // 添加20px的额外间距
        console.log('使用固定顶部边距:', fixedMarginTop + 'px');
        
        // 应用固定的顶部边距
        heading.style.marginTop = fixedMarginTop + 'px';
        heading.style.position = 'relative';
        heading.style.zIndex = '1';
        heading.style.transition = 'none'; // 禁用过渡效果，避免闪烁
        heading.dataset.fixed = 'true'; // 标记为已修复
        console.log('已静态调整Products标题位置，添加固定顶部边距:', fixedMarginTop + 'px');
        
        // 同时调整标题的父元素，移除过大的内边距
        const headingParent = heading.parentElement;
        if (headingParent) {
          // 重置父元素的内边距
          headingParent.style.paddingTop = '0'; // 重置父元素的内边距
          headingParent.style.position = 'relative';
          headingParent.style.zIndex = '1';
          headingParent.style.transition = 'none'; // 禁用过渡效果，避免闪烁
          console.log('已静态调整标题父元素的内边距，重置为0');
        }
      }
    });
  }
}

// 静态调整商品界面位置，避免与标头重合
function adjustProductLayoutOnMobile() {
  // 检测是否为移动设备
  if (window.innerWidth <= 768) {
    console.log('检测到移动设备，静态调整商品界面位置');
    
    // 根据标头尺寸（320x60）设置固定的顶部边距
    const headerHeight = 60; // 标头高度
    const additionalSpace = 20; // 额外空间
    const totalMarginTop = headerHeight + additionalSpace;
    console.log('标头高度:', headerHeight + 'px, 总顶部边距:', totalMarginTop + 'px');
    
    // 调整商品信息区域
    const productInformation = document.querySelector('.product-information');
    if (productInformation) {
      productInformation.style.marginTop = totalMarginTop + 'px';
      productInformation.style.paddingTop = '20px';
      productInformation.style.position = 'relative';
      productInformation.style.zIndex = '1';
      productInformation.style.transition = 'none'; // 禁用过渡效果，避免闪烁
      console.log('已静态调整商品信息区域，添加固定顶部边距:', totalMarginTop + 'px');
    }
    
    // 调整媒体库区域
    const mediaGallery = document.querySelector('.media-gallery');
    if (mediaGallery) {
      mediaGallery.style.marginTop = '0';
      mediaGallery.style.position = 'relative';
      mediaGallery.style.zIndex = '1';
      console.log('已静态调整媒体库区域，重置顶部边距为0');
    }
    
    // 调整产品详情区域
    const productDetails = document.querySelector('.product-details');
    if (productDetails) {
      productDetails.style.position = 'static';
      productDetails.style.top = 'auto';
      productDetails.style.marginTop = '0';
      console.log('已静态调整产品详情区域，移除粘性定位');
    }
    
    // 调整产品详情包装器
    const productDetailsWrapper = document.querySelector('.product-information__details-wrapper');
    if (productDetailsWrapper) {
      productDetailsWrapper.style.position = 'static';
      productDetailsWrapper.style.top = 'auto';
      productDetailsWrapper.style.alignSelf = 'auto';
      productDetailsWrapper.style.zIndex = '1';
      console.log('已静态调整产品详情包装器，移除粘性定位');
    }
    
    // 调整产品信息网格
    const productGrid = document.querySelector('.product-information__grid');
    if (productGrid) {
      productGrid.style.position = 'relative';
      productGrid.style.zIndex = '1';
      console.log('已静态调整产品信息网格，确保正确的层级关系');
    }
    
    // 分离并重新排序产品描述
    separateAndReorderProductDescription();
    
    // 修复颜色选择器宽度问题
    fixColorSwatchesWidth();
    
    // 修复 Shopify 粘性购物栏，使其始终固定显示
    fixShopifyStickyBar();
  }
}

// 分离并重新排序产品描述
function separateAndReorderProductDescription() {
  // 查找媒体区域
  const mediaArea = document.querySelector('.product-information__media');
  if (!mediaArea) return;
  
  // 查找产品描述元素
  const descriptionElement = mediaArea.querySelector('.product-description-below-media');
  if (!descriptionElement) return;
  
  // 克隆产品描述元素
  const descriptionClone = descriptionElement.cloneNode(true);
  descriptionClone.classList.add('product-description-container');
  
  // 查找产品信息网格
  const productGrid = document.querySelector('.product-information__grid');
  if (!productGrid) return;
  
  // 查找产品详情包装器
  const detailsWrapper = document.querySelector('.product-information__details-wrapper');
  if (!detailsWrapper) return;
  
  // 从媒体区域移除原始描述
  descriptionElement.remove();
  
  // 使用flexbox重新排序元素
  productGrid.style.display = 'flex';
  productGrid.style.flexDirection = 'column';
  
  // 设置元素顺序
  const mediaAreaInGrid = productGrid.querySelector('.product-information__media');
  if (mediaAreaInGrid) {
    mediaAreaInGrid.style.order = '0';
  }
  
  detailsWrapper.style.order = '1';
  
  // 将克隆的描述添加到网格中
  productGrid.appendChild(descriptionClone);
  descriptionClone.style.order = '2';
  
  console.log('已分离并重新排序产品描述，产品详情现在显示在产品描述之前');
}

// 修复颜色选择器宽度问题
function fixColorSwatchesWidth() {
  // 查找颜色选择器元素
  const colorSwatches = document.querySelector('[name="orichi-swatches"]');
  if (colorSwatches) {
    // 移除过小的max-width
    colorSwatches.style.maxWidth = '100%';
    colorSwatches.style.width = '100%';
    console.log('已修复颜色选择器宽度，设置为100%');
  }
  
  // 同时修复颜色选择器内部元素的宽度
  const swatchesContainer = document.querySelector('.orichi-swatches-template-11723524309238');
  if (swatchesContainer) {
    swatchesContainer.style.maxWidth = '100%';
    swatchesContainer.style.width = '100%';
  }
  
  // 修复swiper容器宽度
  const swiperContainer = document.querySelector('.orichi-swatches-swiper');
  if (swiperContainer) {
    swiperContainer.style.maxWidth = '100%';
    swiperContainer.style.width = '100%';
  }
}

// 修复 Shopify 粘性购物栏，使其始终固定显示
function fixShopifyStickyBar() {
  // 检测是否为移动设备
  if (window.innerWidth > 768) return;
  
  // 查找 Shopify 自带的粘性购物栏
  const stickyBar = document.querySelector('.sticky-add-to-cart__bar');
  if (!stickyBar) return;
  
  // 设置购物栏为始终固定显示
  stickyBar.style.position = 'fixed';
  stickyBar.style.bottom = '0';
  stickyBar.style.left = '0';
  stickyBar.style.right = '0';
  stickyBar.style.zIndex = '9999';
  stickyBar.style.transform = 'translateY(0)';
  stickyBar.style.visibility = 'visible';
  stickyBar.style.opacity = '1';
  
  // 设置 data-stuck 属性为 true，表示已固定
  stickyBar.setAttribute('data-stuck', 'true');
  
  // 移除可能的滚动监听事件
  // 由于我们无法直接访问 Shopify 的内部代码，我们可以通过覆盖样式来确保购物栏始终显示
  
  // 添加一个样式规则，确保购物栏不会被隐藏
  const style = document.createElement('style');
  style.textContent = `
    .sticky-add-to-cart__bar {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      transform: translateY(0) !important;
      visibility: visible !important;
      opacity: 1 !important;
      z-index: 9999 !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('已修复 Shopify 粘性购物栏，使其始终固定显示');
}



// 优化导航菜单
function optimizeNavigation() {
  console.log('初始化导航菜单优化');
  
  // 确保菜单抽屉在移动设备上正常工作
  const menuButton = document.querySelector('.header__icon--menu');
  const menuDrawer = document.querySelector('.menu-drawer');
  
  console.log('菜单按钮:', menuButton);
  console.log('菜单抽屉:', menuDrawer);
  
  if (menuButton && menuDrawer) {
    console.log('添加菜单按钮点击事件监听器');
    
    // 移除可能存在的旧监听器
    menuButton.removeEventListener('click', handleMenuClick);
    
    // 添加新的点击事件监听器
    menuButton.addEventListener('click', handleMenuClick);
  } else {
    console.log('菜单按钮或菜单抽屉不存在');
  }
  
  // 点击外部关闭菜单抽屉
  document.addEventListener('click', function(event) {
    const menuDrawer = document.querySelector('.menu-drawer');
    const menuButton = document.querySelector('.header__icon--menu');
    const target = event.target;
    
    if (menuDrawer && menuButton && target instanceof Node && !menuDrawer.contains(target) && !menuButton.contains(target)) {
      const details = document.querySelector('#Details-menu-drawer-container');
      if (details) {
        console.log('点击外部，关闭菜单');
        // 使用更可靠的方法来移除open属性
        details.removeAttribute('open');
      }
    }
  });
}

// 实现离线支持
function enableOfflineSupport() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('Service Worker 注册成功:', registration.scope);
        })
        .catch(function(error) {
          console.error('Service Worker 注册失败:', error);
        });
    });
  }
}

// 性能监控
function monitorPerformance() {
  if ('performance' in window && 'measure' in performance) {
    // 监控核心Web指标
    
    // LCP (Largest Contentful Paint)
    new PerformanceObserver(function(entryList) {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        console.log('LCP:', lastEntry.startTime);
        
        // 发送到分析服务
        if ('ga' in window && typeof window.ga === 'function') {
          window.ga('send', 'event', 'Performance', 'LCP', lastEntry.startTime);
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID (First Input Delay)
    new PerformanceObserver(function(entryList) {
      const entries = entryList.getEntries();
      entries.forEach(function(entry) {
        // @ts-ignore - 忽略类型检查错误，processingStart在运行时存在
        const processingStart = entry.processingStart;
        // @ts-ignore - 忽略类型检查错误，startTime在运行时存在
        const startTime = entry.startTime;
        if (typeof processingStart === 'number' && typeof startTime === 'number') {
          console.log('FID:', processingStart - startTime);
          
          // 发送到分析服务
          if ('ga' in window && typeof window.ga === 'function') {
            window.ga('send', 'event', 'Performance', 'FID', processingStart - startTime);
          }
        }
      });
    }).observe({ type: 'first-input', buffered: true });
    
    // CLS (Cumulative Layout Shift)
    new PerformanceObserver(function(entryList) {
      let cumulativeLayoutShift = 0;
      entryList.getEntries().forEach(function(entry) {
        // @ts-ignore - 忽略类型检查错误，hadRecentInput在运行时存在
        const hadRecentInput = entry.hadRecentInput;
        if (!hadRecentInput) {
          // @ts-ignore - 忽略类型检查错误，value在运行时存在
          const value = entry.value;
          if (typeof value === 'number') {
            cumulativeLayoutShift += value;
            console.log('CLS:', cumulativeLayoutShift);
            
            // 发送到分析服务
            if ('ga' in window && typeof window.ga === 'function') {
              window.ga('send', 'event', 'Performance', 'CLS', cumulativeLayoutShift);
            }
          }
        }
      });
    }).observe({ type: 'layout-shift', buffered: true });
  }
}

// 初始化移动设备优化
function initMobileOptimization() {
  console.log('初始化移动设备优化');
  
  // 执行各项优化
  optimizeScrolling();
  enableTouchGestures();
  optimizeImageLoading();
  optimizeFormInputs();
  optimizeNavigation();
  enableOfflineSupport();
  monitorPerformance();
  
  // 调整Products标题位置
  adjustProductsHeadingPosition();
  
  // 静态调整商品界面位置，避免与标头重合
  adjustProductLayoutOnMobile();
  
  // 添加触摸波纹效果到按钮
  const buttons = document.querySelectorAll('.button, .menu-drawer__menu-item');
  buttons.forEach(function(button) {
    button.classList.add('touch-ripple');
  });
  
  // 添加窗口大小改变事件监听器
  window.addEventListener('resize', function() {
    adjustProductsHeadingPosition();
    adjustProductLayoutOnMobile();
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileOptimization);
} else {
  initMobileOptimization();
}

// 导出模块
export { initMobileOptimization };
