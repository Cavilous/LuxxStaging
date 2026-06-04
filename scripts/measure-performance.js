
const { execFileSync } = require('child_process');

const urls = [
  'http://localhost:5000/cars-listing',
  'http://localhost:5000/car-brand/ferrari',
  'http://localhost:5000/',
];

console.log('📊 Running Lighthouse Performance Tests...\n');

urls.forEach(url => {
  console.log(`Testing: ${url}`);
  try {
    const result = execFileSync(
      'npx',
      ['lighthouse', url, '--only-categories=performance', '--output=json', '--quiet'],
      { encoding: 'utf-8' }
    );
    
    const data = JSON.parse(result);
    const metrics = data.audits;
    
    console.log(`  ✓ LCP: ${metrics['largest-contentful-paint'].displayValue}`);
    console.log(`  ✓ FCP: ${metrics['first-contentful-paint'].displayValue}`);
    console.log(`  ✓ TTFB: ${metrics['server-response-time'].displayValue}`);
    console.log(`  ✓ Performance Score: ${data.categories.performance.score * 100}/100`);
    console.log('');
  } catch (error) {
    console.error(`  ✗ Error testing ${url}`);
  }
});

console.log('\n💡 Tips:');
console.log('- Check Network tab for image sizes and caching headers');
console.log('- Verify /_next/image URLs have Cache-Control: public, max-age=31536000');
console.log('- First 8 cards should load with fetchPriority="high"');
