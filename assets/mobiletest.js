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
  
  // 移除可能存在的touchstart事件监听器，避免阻止标头点击
  // 注意：不再添加全局的touchstart事件监听器，以确保标头可以正常点击
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
  
  // 处理菜单打开/关闭时的标头样式
  // 使用更全面的选择器来查找所有可能的标头元素
  const headerElements = document.querySelectorAll('header-component, .header, #header-group, .header-section, .header-row, .header__top, .header__bottom, .header__middle');
  headerElements.forEach(function(header) {
    if (menuOpen) {
      // 菜单打开时，直接隐藏标头元素
      header.style.display = 'none !important'; // 使用!important确保样式不会被覆盖
      console.log('菜单打开，隐藏标头元素:', header);
    } else {
      // 菜单关闭时，恢复标头元素的显示
      header.style.display = '' !important; // 使用!important确保样式不会被覆盖
      console.log('菜单关闭，恢复标头元素显示:', header);
    }
  });
  
  // 同时处理标头内的其他元素
  const headerChildren = document.querySelectorAll('.header *');
  headerChildren.forEach(function(child) {
    if (menuOpen) {
      // 菜单打开时，直接隐藏标头内的所有元素
      child.style.display = 'none !important'; // 使用!important确保样式不会被覆盖
    } else {
      // 菜单关闭时，恢复标头内的所有元素显示
      child.style.display = '' !important; // 使用!important确保样式不会被覆盖
    }
  });
  
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
  console.log('标头元素数量:', headerElements.length);
  console.log('菜单栏元素:', menuDrawer);
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

// 修复移动设备上的标头重叠问题
function fixHeaderOverlap() {
  // 检测是否为移动设备
  if (window.innerWidth <= 768) {
    console.log('检测到移动设备，调整标头位置');
    
    // 1. 重置所有可能导致问题的样式
    document.body.style.paddingTop = '0';
    document.documentElement.style.paddingTop = '0';
    document.body.style.marginTop = '0';
    document.documentElement.style.marginTop = '0';
    console.log('已重置页面主体的边距和内边距');
    
    // 2. 检查并优化视口设置
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport instanceof HTMLMetaElement) {
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      console.log('已优化视口设置');
    }
    
    // 3. 隐藏标头内的"Products"文字
    const headerColumns = document.querySelector('.header__columns');
    if (headerColumns) {
      console.log('找到header__columns元素，开始修复重叠问题');
      
      // 遍历header__columns内的所有子元素
      const headerChildren = headerColumns.querySelectorAll('*');
      headerChildren.forEach(function(child) {
        if (child && child.textContent && child.textContent.includes('Products')) {
          console.log('找到标头内的Products文字元素:', child.tagName || child.className);
          child.style.display = 'none';
          console.log('已隐藏标头内的Products文字元素');
        }
      });
    }
    
    // 4. 修复标头内的可点击元素
    const clickableElements = document.querySelectorAll('.header a, .header button, .header input, .header select, .header__icon--menu');
    clickableElements.forEach(function(element) {
      if (element) {
        element.style.pointerEvents = 'auto';
        element.style.position = 'relative';
        element.style.zIndex = '10000';
        console.log('已修复可点击元素:', element.tagName || element.className);
      }
    });
    
    // 5. 修复logo显示问题
    const logo = document.querySelector('.header-logo');
    if (logo && !logo.dataset.fixed) {
      console.log('找到logo，开始修复显示问题');
      
      // 强制设置logo样式
      logo.style.pointerEvents = 'auto !important';
      logo.style.position = 'relative !important';
      logo.style.zIndex = '10000 !important';
      logo.style.display = 'inline-block !important';
      logo.style.width = 'auto !important';
      logo.style.height = 'auto !important';
      logo.style.whiteSpace = 'nowrap !important';
      logo.style.overflow = 'visible !important';
      logo.style.backgroundColor = getComputedStyle(logo).backgroundColor || '#ffffff';
      logo.style.transition = 'none !important';
      logo.style.transform = 'none !important';
      logo.style.margin = '0 !important';
      logo.style.padding = '0 !important';
      logo.dataset.fixed = 'true';
      
      // 修复logo容器
      const logoContainer = logo.querySelector('.header-logo__image-container');
      if (logoContainer) {
        logoContainer.style.display = 'inline-block !important';
        logoContainer.style.textAlign = 'center !important';
        logoContainer.style.transition = 'none !important';
        logoContainer.style.transform = 'none !important';
        logoContainer.style.margin = '0 !important';
        logoContainer.style.padding = '0 !important';
      }
      
      // 修复logo父元素
      const logoParent = logo.parentElement;
      if (logoParent) {
        logoParent.style.display = 'block !important';
        logoParent.style.textAlign = 'center !important';
        logoParent.style.transition = 'none !important';
        logoParent.style.transform = 'none !important';
      }
      
      // 修复logo图片
      const logoImage = logo.querySelector('img');
      if (logoImage) {
        logoImage.style.display = 'block !important';
        logoImage.style.width = 'auto !important';
        logoImage.style.height = 'auto !important';
        logoImage.style.transition = 'none !important';
        logoImage.style.transform = 'none !important';
        console.log('已修复logo图片');
      }
      
      console.log('已修复logo显示问题');
    }
    
    // 6. 修复菜单按钮
    const menuButton = document.querySelector('.header__icon--menu');
    if (menuButton) {
      menuButton.style.pointerEvents = 'auto';
      menuButton.style.position = 'relative';
      menuButton.style.zIndex = '10000';
      console.log('已修复菜单按钮点击');
    }
    
    // 7. 修复Products标题位置
    const productsHeadings = document.querySelectorAll('h1');
    productsHeadings.forEach(function(heading) {
      if (heading && heading.textContent && heading.textContent.includes('Products')) {
        console.log('找到页面内容中的Products标题元素:', heading.tagName || heading.className);
        const result = adjustProductsHeadingPosition(heading);
        if (result) {
          heading.dataset.fixed = 'true';
          console.log('Products标题位置修复完成');
        }
      }
    });
    
    // 8. 添加调试信息
    console.log('标头修复完成，当前状态:');
    console.log('页面主体paddingTop:', getComputedStyle(document.body).paddingTop);
    console.log('页面主体marginTop:', getComputedStyle(document.body).marginTop);
    if (menuButton) {
      console.log('菜单按钮pointerEvents:', getComputedStyle(menuButton).pointerEvents);
      console.log('菜单按钮zIndex:', getComputedStyle(menuButton).zIndex);
    }
  }
}

// 添加全局滚动事件监听器，实现上划时显示标头的效果
(function addHeaderScrollListener() {
  console.log('添加标头滚动事件监听器');
  
  // 强制添加事件监听器
  window._headerScrollListenerAdded = true;
  
  let lastScrollTop = 0;
  
  // 使用更可靠的滚动事件监听器，移除延迟
  window.addEventListener('scroll', function() {
    console.log('滚动事件触发');
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log('滚动位置:', scrollTop, '上一次滚动位置:', lastScrollTop);
    
    // 只在移动设备上执行
    if (window.innerWidth <= 768) {
      console.log('检测到移动设备，执行标头显示逻辑');
      
      // 使用更广泛的选择器，确保能找到所有页面的标头元素
      const headerElements = document.querySelectorAll('header, .header, header-component, .header-section, #header-group, .announcement-bar, .header-row, .header__top, .header__bottom, .header__middle, .header-container, .header-wrapper');
      console.log('找到标头元素数量:', headerElements.length);
      
      // 显示找到的标头元素信息
      headerElements.forEach(function(element, index) {
        console.log('标头元素', index, ':', element.tagName, element.className, element.id);
      });
      
      // 强制显示所有标头元素，无论滚动方向
      headerElements.forEach(function(element) {
        if (element) {
          console.log('处理标头元素:', element.className);
          
          // 强制设置标头样式，确保立即显示
          element.style.position = 'fixed !important';
          element.style.top = '0 !important';
          element.style.left = '0 !important';
          element.style.width = '100% !important';
          element.style.zIndex = '9999 !important';
          element.style.transform = 'translateY(0) !important';
          element.style.opacity = '1 !important';
          element.style.visibility = 'visible !important';
          element.style.display = 'block !important';
          element.style.background = 'rgba(255, 255, 255, 0.95) !important'; // 半透明背景，确保可读性
          element.style.backdropFilter = 'blur(10px) !important'; // 添加模糊效果
          element.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1) !important'; // 添加阴影效果
          
          console.log('已强制显示标头元素');
        }
      });
    }
    
    // 更新上一次滚动位置
    lastScrollTop = scrollTop;
  }, { passive: true });
  
  console.log('标头滚动事件监听器添加完成');
})();

// 确保标头在页面加载时就显示
(function ensureHeaderVisibleOnLoad() {
  console.log('确保标头在页面加载时就显示');
  
  // 页面加载完成后执行
  window.addEventListener('load', function() {
    console.log('页面加载完成，确保标头显示');
    
    // 只在移动设备上执行
    if (window.innerWidth <= 768) {
      console.log('检测到移动设备，强制显示标头');
      
      // 使用更广泛的选择器，确保能找到所有页面的标头元素
      const headerElements = document.querySelectorAll('header, .header, header-component, .header-section, #header-group, .announcement-bar, .header-row, .header__top, .header__bottom, .header__middle, .header-container, .header-wrapper');
      console.log('找到标头元素数量:', headerElements.length);
      
      // 强制显示所有标头元素
      headerElements.forEach(function(element) {
        if (element) {
          console.log('处理标头元素:', element.className);
          
          // 强制设置标头样式，确保在页面加载时就显示
          element.style.position = 'fixed !important';
          element.style.top = '0 !important';
          element.style.left = '0 !important';
          element.style.width = '100% !important';
          element.style.zIndex = '9999 !important';
          element.style.transform = 'translateY(0) !important';
          element.style.opacity = '1 !important';
          element.style.visibility = 'visible !important';
          element.style.display = 'block !important';
          element.style.background = 'rgba(255, 255, 255, 0.95) !important'; // 半透明背景，确保可读性
          element.style.backdropFilter = 'blur(10px) !important'; // 添加模糊效果
          element.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1) !important'; // 添加阴影效果
          
          console.log('已强制显示标头元素');
        }
      });
    }
  });
  
  // DOM内容加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM内容加载完成，确保标头显示');
    
    // 只在移动设备上执行
    if (window.innerWidth <= 768) {
      console.log('检测到移动设备，强制显示标头');
      
      // 使用更广泛的选择器，确保能找到所有页面的标头元素
      const headerElements = document.querySelectorAll('header, .header, header-component, .header-section, #header-group, .announcement-bar, .header-row, .header__top, .header__bottom, .header__middle, .header-container, .header-wrapper');
      console.log('找到标头元素数量:', headerElements.length);
      
      // 强制显示所有标头元素
      headerElements.forEach(function(element) {
        if (element) {
          console.log('处理标头元素:', element.className);
          
          // 强制设置标头样式，确保在DOM加载完成时就显示
          element.style.position = 'fixed !important';
          element.style.top = '0 !important';
          element.style.left = '0 !important';
          element.style.width = '100% !important';
          element.style.zIndex = '9999 !important';
          element.style.transform = 'translateY(0) !important';
          element.style.opacity = '1 !important';
          element.style.visibility = 'visible !important';
          element.style.display = 'block !important';
          element.style.background = 'rgba(255, 255, 255, 0.95) !important'; // 半透明背景，确保可读性
          element.style.backdropFilter = 'blur(10px) !important'; // 添加模糊效果
          element.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1) !important'; // 添加阴影效果
          
          console.log('已强制显示标头元素');
        }
      });
    }
  });
})();

// 静态调整Products标题位置
function adjustProductsHeadingPosition(heading) {
  // 确保标题元素存在
  if (!heading) return;
  
  // 直接设置固定的顶部边距，确保Products标题显示在标头下方，距离不要太远
  const fixedMarginTop = 20; // 20px的固定顶部边距
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
  
  // 执行一次后立即停止，避免后续调整
  return true;
}

// 节流函数，限制函数执行频率
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 监听标头变化，确保修复持续生效
function observeHeaderChanges() {
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const header = document.querySelector('.header');
  
  // 选择要观察的目标元素
  const targetElement = headerGroup || headerComponent || header;
  
  if (targetElement) {
    console.log('开始监听标头变化');
    
    // 创建节流版本的修复函数，避免频繁调整导致闪烁
    const throttledFix = throttle(function() {
      // 检查是否已经有Products标题被修复
      const fixedHeading = document.querySelector('h1[data-fixed="true"]');
      if (fixedHeading) {
        console.log('Products标题已经被修复，跳过本次修复');
        return;
      }
      
      // 检查是否已经有logo被修复
      const fixedLogo = document.querySelector('.header-logo[data-fixed="true"]');
      if (fixedLogo) {
        console.log('Logo已经被修复，跳过本次修复');
        return;
      }
      
      fixHeaderOverlap();
      
      // 同时检查并调整Products标题位置
      const productsHeadings = document.querySelectorAll('h1');
      productsHeadings.forEach(function(heading) {
        // 跳过已经被修复的标题
        if (heading && heading.dataset.fixed === 'true') {
          console.log('Products标题已经被修复，跳过');
          return;
        }
        
        if (heading && heading.textContent && heading.textContent.includes('Products')) {
          adjustProductsHeadingPosition(heading);
        }
      });
    }, 200); // 200ms的节流间隔，避免频繁调整
    
    // 创建MutationObserver实例
    const observer = new MutationObserver(function(mutations) {
      // 当标头发生变化时，使用节流函数重新应用修复
      console.log('检测到标头变化，使用节流函数重新应用修复');
      throttledFix();
    });
    
    // 配置观察选项
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    };
    
    // 开始观察目标元素
    observer.observe(targetElement, config);
    
    // 同时监听窗口大小变化，使用节流函数
    window.addEventListener('resize', throttledFix);
    
    // 监听滚动事件，使用节流函数
    window.addEventListener('scroll', throttledFix);
    
    console.log('已设置标头变化监听，使用节流函数避免频繁调整');
  }
}

// 立即执行标头重叠修复（页面加载的最早时机）
(function immediateHeaderFix() {
  console.log('立即执行标头重叠修复（页面加载的最早时机）');
  
  // 首先修复logo，确保它一开始就居中显示，并且不再变化
  const logo = document.querySelector('.header-logo');
  if (logo) {
    console.log('找到logo，立即修复居中:', logo);
    
    // 强制设置logo样式，使用!important确保不会被其他样式覆盖
    logo.style.pointerEvents = 'auto !important';
    logo.style.position = 'relative !important';
    logo.style.zIndex = '10000 !important';
    logo.style.display = 'inline-block !important';
    logo.style.width = 'auto !important';
    logo.style.height = 'auto !important';
    logo.style.whiteSpace = 'nowrap !important';
    logo.style.overflow = 'visible !important';
    logo.style.backgroundColor = getComputedStyle(logo).backgroundColor || '#ffffff';
    logo.style.transition = 'none !important'; // 禁用过渡效果，避免闪烁
    logo.style.transform = 'none !important'; // 禁用变换效果，避免位置变化
    logo.style.margin = '0 !important'; // 重置margin
    logo.style.padding = '0 !important'; // 重置padding
    logo.dataset.fixed = 'true'; // 标记为已修复
    
    // 为logo容器添加强制居中样式
    const logoContainer = logo.querySelector('.header-logo__image-container');
    if (logoContainer) {
      logoContainer.style.display = 'inline-block !important';
      logoContainer.style.textAlign = 'center !important';
      logoContainer.style.transition = 'none !important'; // 禁用过渡效果，避免闪烁
      logoContainer.style.transform = 'none !important'; // 禁用变换效果，避免位置变化
      logoContainer.style.margin = '0 !important'; // 重置margin
      logoContainer.style.padding = '0 !important'; // 重置padding
    }
    
    // 确保logo的父元素也不会影响它的样式
    const logoParent = logo.parentElement;
    if (logoParent) {
      logoParent.style.display = 'block !important';
      logoParent.style.textAlign = 'center !important';
      logoParent.style.transition = 'none !important'; // 禁用过渡效果，避免闪烁
      logoParent.style.transform = 'none !important'; // 禁用变换效果，避免位置变化
    }
    
    console.log('已立即修复logo居中显示，样式已强制固定');
  }
  
  // 然后修复Products标题
  const productsHeadings = document.querySelectorAll('h1');
  productsHeadings.forEach(function(heading) {
    if (heading && heading.textContent && heading.textContent.includes('Products')) {
      console.log('找到Products标题，立即修复:', heading);
      
      // 直接设置固定的顶部边距，确保Products标题显示在标头下方，距离不要太远
      const fixedMarginTop = 20; // 20px的固定顶部边距
      heading.style.marginTop = fixedMarginTop + 'px !important';
      heading.style.position = 'relative !important';
      heading.style.zIndex = '1 !important';
      heading.style.transition = 'none !important'; // 禁用过渡效果
      heading.style.transform = 'none !important'; // 禁用变换效果，避免位置变化
      heading.dataset.fixed = 'true'; // 标记为已修复
      console.log('已立即修复Products标题位置，固定边距:', fixedMarginTop + 'px');
      
      // 同时调整父元素，移除过大的内边距
      const headingParent = heading.parentElement;
      if (headingParent) {
        headingParent.style.paddingTop = '0 !important'; // 重置父元素的内边距
        headingParent.style.position = 'relative !important';
        headingParent.style.zIndex = '1 !important';
        headingParent.style.transition = 'none !important'; // 禁用过渡效果
        headingParent.style.transform = 'none !important'; // 禁用变换效果，避免位置变化
      }
    }
  });
})();

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
  
  // 监听标头变化，确保修复持续生效
  observeHeaderChanges();
  
  // 移除延迟执行，避免多次调整导致的闪烁
  
  // 添加触摸波纹效果到按钮
  const buttons = document.querySelectorAll('.button, .menu-drawer__menu-item');
  buttons.forEach(function(button) {
    button.classList.add('touch-ripple');
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
