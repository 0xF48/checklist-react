var PropTypes = require('react').PropTypes

module.exports = {
	contextTypes: {
		_intui_slide: PropTypes.bool,
		total_beta: PropTypes.number,
		vertical: PropTypes.bool,
		auto_h: PropTypes.bool,
		auto_w: PropTypes.bool,
		path: PropTypes.string
	},

	childContextTypes: {
		_intui_slide: PropTypes.bool,
		vertical: PropTypes.bool,
		total_beta: PropTypes.number,
		vertical: PropTypes.bool,
		auto_h: PropTypes.bool,
		auto_w: PropTypes.bool
	},
}