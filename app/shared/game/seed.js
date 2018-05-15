(function () {
	  "use strict";
	  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

		class Seed{
			constructor(name){
				this.name = name;
			}

			update(dt) {

			}

			draw(ctx) {

			}
		}

		if (isNode) {
			module.export = Seed;
		}
		else {
			window.Seed = Seed;
		}
})();
