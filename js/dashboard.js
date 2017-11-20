Vue.config.debug = true;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Vue.transition('reload', {
	enterClass: "flipInX",
	leaveClass: "fadeOutLeft",
});

Vue.component('competitors', {
	props: ['list', 'showGroups'],
	template: '#competitors-template',
});

Vue.component('athlete', {
	props: ['data'],
	template: '#profile-template',
	computed: {
		groupName: function() {
			return this.data.userFirstName.capitalize() + ' ' + this.data.userLastInitial + '.';
		},
		numTarget: function() {
			if (this.data.style == '(SC)') {
				return this.data.target + '*';
			} else {
				return this.data.target;
			}
		}
	}
});

new Vue({
	el: '#leaderboard-app',

	data: {
		test: '',
		competitors: [],
		tests: [],
		showProfile: true,
		numProfile: 0,
		pageOfLeaderboard: 0,
		numTopProfileSticky: 3,
		numPagesOfLeaderboard: 0,
		numProfilePerPage: 10,
		leaderboardPageDelay: 10000,
		ajaxErrorCount: 0,
		reps: [],
		percentPrescribed: 0,
	},

	methods: {
		updateData: function() {
			this.competitors = [];
			this.showAthletes = false;
			this.$http.get('https://getbadges.io/api/app/webhook/#{token}', function (response, status, request) {

				this.test = response.tests[0].title;
                competitors = response.results;
                this.competitors = this.addRepsStats(competitors);
                this.numAthletes = response.results.length;
                this.numPagesOfLeaderboard = this.calcNumPages();
                this.pageOfLeaderboard = 0;

                this.showAthletes = true;
                this.ajaxErrorCount = 0;

                this.cycleLeaderboard();

            }).catch(function (data, status, request) {
            	if (this.ajaxErrorCount < 3) {
            		this.ajaxErrorCount += 1;
            		this.updateData();
            	} else {
            		return false;
            	}
            });
		},
		cycleLeaderboard: function() {
			if (this.pageOfLeaderboard < this.numPagesOfLeaderboard) {
				this.pageOfLeaderboard += 1
				setTimeout(this.cycleLeaderboard, this.leaderboardPageDelay)
			} else {
				this.updateData()
			}
		},
		addTargetStats: function(competitors) {
			reps = []
			rxCount = 0
			scCount = 0
			for (var key in competitors) {
				var testStats = competitors[key].tests[0].split(' ');
				competitors[key]['target'] = testStats[0]
				competitors[key]['style'] = testStats[1]

				reps.push(testStats[0])
				if (testStats[1] == '(RX)') {
					rxCount += 1
				} else {
					scCount += 1
				}
			}
			this.reps = reps
			this.percentPrescribed = Math.round(rxCount / (rxCount + scCount) * 100)
			return competitors
		},
		calcNumPages: function() {
			var numPaginatedProfiles = (this.numProfile - this.numTopProfileSticky)
			var numProfilesPerPage = this.numProfilePerPage
			if (numPaginatedProfiles % numProfilesPerPage) {
				return Math.floor(numPaginatedAthletes / numProfilesPerPage) + 1;
			} else {
				return Math.floor(numPaginatedAthletes / numProfilesPerPage);
			}
		}
	},

	computed: {
		leaderboardTitle: function() {
			if (this.ajaxErrorCount < 3) {
				return this.test + ' Leaderboard';
			} else {
				return "No data. Please reload."
			}
		},
		topX: function() {
			return this.competitors.slice(0,this.numTopProfileSticky);
		},
		leaderboardPage: function() {
			var start = (this.pageOfLeaderboard - 1) * this.numProfilesPerPage + 5
			var end = start + this.numProfilesPerPage
			if (end > this.numProfile) {
				end = this.numProfiles
			}
			return this.competitors.slice(start, end);
		},
		medianReps: function() {
			var middle = Math.floor(this.numProfiles / 2);
			return this.reps[middle]
		},
		maxReps: function() {
			return this.reps[0];
		}
	},

    ready: function() {
        this.updateData();
    },
});
