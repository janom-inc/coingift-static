
function number_format(num) {
	return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

const ITEM_ID = '558964e9-9934-4baf-8373-77166c3db725';

/**
 * Fetch item details.
 */
$.getJSON('https://coingift.jp/pubapi/v0/items/get/'+ITEM_ID, function(data) {
	console.log(data);
	if(data.status !== 'ok') {
		alert('fatal: remote server responded as an error!');
		return;
	}
	$('.item-price').html(number_format(data.return.price));
	Object.keys(data.return.prices).forEach(function(k) {
		$('.item-price-'+k).html(number_format(data.return.prices[k]));
	});
	// MONA.
	$.getJSON('https://coingift.jp/etwings-api-mirror/api/1/ticker/mona_jpy', function(dataMONA) {
		//var price = (dataMONA.bid + dataMONA.ask) / 2.0;
		var price = dataMONA.bid;
		$('.mona-price').html(number_format(price));
		$('.item-price-mona-effective').html(number_format((data.return.prices.MONA * price).toFixed(0)));
	});
	// BTC.
	$.getJSON('https://coingift.jp/etwings-api-mirror/api/1/ticker/btc_jpy', function(dataBTC) {
		var price = dataBTC.bid;
		$('.btc-price').html(number_format(price));
		$('.item-price-btc-effective').html(number_format((data.return.prices.BTC * price).toFixed(0)));
	});
	// XRP.
	var remote = new ripple.Remote({
		servers: [ 'wss://s1.ripple.com:443' ]
	});
	remote.connect(function() {
		options = {
			gets: {
				issuer: 'r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN', // ~TokyoJPY
				currency: 'JPY',
			},
			pays: {
				currency: 'XRP',
			},
			limit: 1,
		};
		remote.requestBookOffers(options, function(err, offers) {
			console.log(offers);
			var price = 1e6 * offers.offers[0].TakerGets.value / offers.offers[0].TakerPays;
			$('.xrp-price').html(number_format(price.toFixed(2)));
			$('.item-price-xrp-effective').html(number_format((data.return.prices.XRP * price).toFixed(0)));
		});
	});
});




