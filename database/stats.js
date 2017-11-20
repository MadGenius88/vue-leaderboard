var vueRock = new Vue({
    el: '#my_view',
    data: {
      totalItems: 0
    },
    methods: {
      fetchData: function(){
        $.ajax({
        url: 'https://getbadges.io/api/app/webhook/#{token}',
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
          var data = this;
[
	{"First":"Jane","Last":"Doe","Amount":"$75.00 "},
	{"First":"John","Last":"Doe","Amount":"$50.00 "},
	{"First":"James","Last":"Smith","Amount":"$100.00 "},
	{"First":"Frank","Last":"West","Amount":"$5.00 "},
	{"First":"John","Last":"Eric","Amount":"$32.00 "},
	{"First":"Melissa","Last":"Stone","Amount":"$14.00 "},
	{"First":"Fakey","Last":"McNamey","Amount":"$200.00 "},
	{"First":"Notta","Last":"Person","Amount":"$150.00 "},
	{"First":"John","Last":"McClaine","Amount":"$75.00"}
];
          self.totalItems = data;

          // Or this way
          vueRock.$set('totalItems', data);

        });
      }
    }
});
