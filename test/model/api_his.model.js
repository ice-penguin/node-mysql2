var Table = require('../util');

//赠品
var GiftSchema = new Table({
	_organization:{
	  type:String,
      ref:"User",
	  default:"11111",
	  require:true//默认为false
    },//所属机构
    aaa:{
        type:Number,
		default:22,
		require:true
    },
	name:String,//活动名称
	startDate:Date,//活动开始时间
	endDate:{
        type:Date,
        default:new Date()
    },//活动结束时间
	isMatch:{
		type:Boolean,
		default:false
	},//是否只生效最先匹配的
	// giftRules:[{
	// 	type:String,
	// 	ref:"GiftRule"
	// }],//活动规则
	createDate:Date,
	isDelete:{
		type:Boolean,
		default:false
	}//是否删除
},"gift");

module.exports = GiftSchema;

