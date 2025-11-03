const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  const url = 'https://67402fe0.humanit-webapp.pages.dev';

  console.log('🔍 모바일 반응형 테스트 시작...\n');

  for (const device of devices) {
    const page = await browser.newPage();
    
    await page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: 2,
      isMobile: device.width < 768,
      hasTouch: device.width < 768
    });

    console.log(`\n📱 ${device.name} (${device.width}x${device.height})`);
    console.log('─'.repeat(50));

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // 사업영역 카드 체크
      const businessCards = await page.$$('.grid.grid-cols-2 > div');
      console.log(`✓ 사업영역 카드 개수: ${businessCards.length}/4 (2x2 그리드)`);

      // 카드 크기 체크
      if (businessCards.length > 0) {
        const cardBox = await businessCards[0].boundingBox();
        if (cardBox) {
          console.log(`✓ 카드 크기: ${Math.round(cardBox.width)}px x ${Math.round(cardBox.height)}px`);
        }
      }

      // "Why Choose Us" 카드 체크
      const whyChooseUsCards = await page.$$('.grid.grid-cols-1.md\\:grid-cols-4 > div');
      console.log(`✓ Why Choose Us 카드: ${whyChooseUsCards.length}/4`);

      // 스크롤 가능한지 체크
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = device.height;
      console.log(`✓ 페이지 높이: ${bodyHeight}px (스크롤: ${bodyHeight > viewportHeight ? '필요' : '불필요'})`);

      // 오버플로우 체크
      const overflowIssues = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let issues = 0;
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth) {
            issues++;
          }
        });
        return issues;
      });
      
      if (overflowIssues > 0) {
        console.log(`⚠️  가로 오버플로우 요소: ${overflowIssues}개`);
      } else {
        console.log(`✓ 가로 오버플로우: 없음`);
      }

      // 터치 가능한 요소 크기 체크 (모바일만)
      if (device.width < 768) {
        const touchableElements = await page.$$('a, button');
        let tooSmall = 0;
        for (const el of touchableElements) {
          const box = await el.boundingBox();
          if (box && (box.width < 44 || box.height < 44)) {
            tooSmall++;
          }
        }
        if (tooSmall > 0) {
          console.log(`⚠️  터치 영역이 작은 요소: ${tooSmall}개`);
        } else {
          console.log(`✓ 터치 영역: 모두 적절함`);
        }
      }

      console.log('✅ 테스트 완료');

    } catch (error) {
      console.log(`❌ 오류: ${error.message}`);
    }

    await page.close();
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📊 모바일 반응형 테스트 완료!');
  console.log('═'.repeat(50));

  await browser.close();
})();
