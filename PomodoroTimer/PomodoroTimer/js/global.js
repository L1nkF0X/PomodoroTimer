window.onload = function () {
	clockTime = 25;
	clockSRestTime = 5;
	soundRemind = true;
	tick = false;
	soundTick = "audio/tick.mp3";
	soundMission = "audio/work.mp3";
	soundMissionDef = soundMission;
	soundRest = "audio/rest.mp3";
	soundRestDef = soundRest;

	var oNav = document.getElementById("nav");
 	var oNavAs = oNav.getElementsByTagName("a");
 	var oPanle = document.getElementById("panle");
 	var oPanles = new Array();
 	for (var i = 0; i < oPanle.childNodes.length; i++) {
 		if (oPanle.childNodes[i].nodeType == 1 & i != 1) {
 			oPanles.push(oPanle.childNodes[i]);
 		}
 	}
 	for (var i = 0; i < oNavAs.length; i++) {
 		oNavAs[i].index = i;
 		oNavAs[i].onclick = function () {
 			for (var i = 0; i < oNavAs.length; i++) {
 				oNavAs[i].className = "";
 				this.className = "on";
 				oPanles[i].className = "hidden";
 				oPanles[this.index].className = "";
 			}
 		}	
 	}
 	var oSet = document.getElementById("set");
 	var oMenuBtns = oSet.getElementsByClassName("button");
 	var oMenuSet = document.getElementById("menu-set");
 	var oMenuSetPanles = new Array();
 	for (var i = 0; i < oMenuSet.childNodes.length; i++) {
 		if (oMenuSet.childNodes[i].nodeType == 1) {
 			oMenuSetPanles.push(oMenuSet.childNodes[i]);
 		}
 	}
 	for (var i = 0; i < oMenuBtns.length; i++) {
 		oMenuBtns[i].index = i;
 		oMenuBtns[i].onclick = function () {
 			for (var i = 0; i < oMenuBtns.length; i++) {
 				oMenuBtns[i].className = "button";
 				this.className = "button on";
 				oMenuSetPanles[i].className = "hidden";
 				oMenuSetPanles[this.index].className = "";
 			}
 		}
 	}
 	function Radio(index, obj) {
 		this.index = index;
 		this.obj = obj;
 		this.obj.offsetLeft;
 		this.obj.style.left;
 	}
 	Radio.prototype = {
		constructor : Radio,
		Console : function () {
		},
		Initialize : function () {
			switch(this.index) {
				case 0 : 
					if (soundRemind) {
						radioItem[this.index].obj.style.left = 0 + "px";
					} else {
						radioItem[this.index].obj.style.left = -50 + "px";
					}
					break;
				case 1 : 
					if (tick) {
						radioItem[this.index].obj.style.left = 0 + "px";
					} else {
						radioItem[this.index].obj.style.left = -50 + "px";
					}
					break;
			}
		},
		Set : function () {
			switch(this.index) {
				case 0 :
					if (this.obj.offsetLeft >= 0) {
						soundRemind = false;
					} else {
						soundRemind = true;
					}
					break;
				case 1 :
					if (this.obj.offsetLeft >= 0) {
						tick = false;
					} else {
						tick = true;
					}
					break;
			}
		}
	}
 	var oRadios = oPanle.getElementsByClassName("radio");
 	var oRadiosUls = oPanle.getElementsByClassName("radio-ul");
	var radioItem = new Array();
	for (var i = 0; i < oRadiosUls.length; i++) {
		radioItem.push(new Radio(i, oRadiosUls[i]));
		radioItem[i].Initialize();
	}
 	for (var i = 0; i < oRadios.length; i++) {
 		(function (index) {
 			oRadios[index].index = index;
 			oRadios[index].onclick = function () {
 				radioItem[index].Console();
 				if (oRadiosUls[this.index].offsetLeft >= 0) {
 					startMove(oRadiosUls[this.index], {left : -50});
 				} else {
 					startMove(oRadiosUls[this.index], {left : 0});
 				}
 				radioItem[index].Set();
 			}
 		})(i)
 	}

 	var oBase = document.getElementById("base");
 	var oBaseUl = oBase.getElementsByTagName("ul")[1];
 	var oBaseLiInput = new Array();
 	
 	// 直接获取所有li元素，然后查找包含input的li
 	var oBaseLis = oBaseUl.getElementsByTagName("li");
 	for (var i = 0; i < oBaseLis.length; i++) {
 		var inputs = oBaseLis[i].getElementsByTagName("input");
 		if (inputs.length > 0) {
 			oBaseLiInput.push(inputs[0]);
 		}
 	}
 	
 	for (var i = 0; i < oBaseLiInput.length; i++) {
 		(function (index) {
 			if (oBaseLiInput[index]) {
 				oBaseLiInput[index].onchange = function () {
 					switch(index) {
 						case 0 :
 							clockTime = oBaseLiInput[index].value;
 							break;
 						case 1 :
 							clockSRestTime = oBaseLiInput[index].value;
 							break;
 					}
 				}
 			}
 		})(i)
 	}
 	var oAddMission = document.getElementById("addMission");
 	var oAddMissionNavClose = document.getElementById("addMission-nav-close");
 	var oCount = document.getElementsByTagName("strong")[0];
 	var oCountValue;
 	var oAddMissionFootButtonConfirm = document.getElementById("addMission-foot-button-confirm");
 	var oMissionName = document.getElementById("missionName");
 	var oMissionNameValue;
 	var subOrAdd = function () {
 		document.getElementById("addMission-main-button-sub").onclick = function () {
   			if (parseInt(oCount.innerHTML) > 1) {
   				oCount.innerHTML = parseInt(oCount.innerHTML) - 1;
   			}
   		}
 		document.getElementById("addMission-main-button-add").onclick = function () {
   			oCount.innerHTML = parseInt(oCount.innerHTML) + 1;
   		}
 	}
 	subOrAdd();
 	oAddMission.onclick = function (e) {
		var e = e || window.event;
    	var elem = e.target || e.srcElement;
    	if (elem.id == "addMission-nav-close" || elem.id == "addMission-foot-button-cancel") {
   			oAddMission.className = "noClick";
   			oCount.innerHTML = 1;
   			oMissionName.value = "";
   			return;
   		}
   		if (elem.id == "addMission-main-button-sub" || elem.id == "addMission-main-button-add" || elem.id == "addMission-foot-button-confirm") {
   			return;
   		}
   		while(elem) {
   			if (elem.id == "addMission") {
   				if (oAddMission.className != "") {
   					oAddMission.className = "";
   				}
   				return;
   			} else {
   				elem = elem.parentNode;
   				oAddMission.className = "noClick";
   			}
   		}
 	}
 	var oBtn = document.getElementById("newMission-btn");
 	oBtn.onclick = function () {
 		if (oAddMission.className != "") {
 			oAddMission.className = "";
 		}
 		var liTotalTime = document.getElementById("li-totalTime");
 		var liMissionTime = document.getElementById("li-missionTime");
 		var liRestTime = document.getElementById("li-restTime");
 		var t = parseInt(clockTime) + parseInt(clockSRestTime);
 		liTotalTime.innerHTML = t + " minutes";
 		liMissionTime.innerHTML = clockTime + " minutes";
 		liRestTime.innerHTML = clockSRestTime + " minutes";
 	}
 	function Sleep(time){
 	  for(var t = Date.now();Date.now() - t <= time;);
 	}

 	au = document.createElement("audio");
 	au.preload="auto";
 	function PlaySound(src) {
 		au.src = src;
 		au.play();
 	}
 	function Mission(index, missionName, workTime, restTime, count) {
		this.index = index;
		this.missionName = missionName;
		this.workTime = workTime;
		this.restTime = restTime;
		this.workTime0 = workTime;
		this.restTime0 = restTime;
		this.count = count;
		this.beginTime = new Date('2016/11/11 00:00:00');
		this.endTime = new Date('2016/11/11 00:00:00');
		this.endTime.setSeconds(workTime);
		this.workLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		this.endTime.setSeconds(restTime);
		this.restLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		this.finishCount = 0;
		this.isWorking = true;  //任务工作或休息标志
		this.oSpan1;
		this.oSpan2;
		this.oSpan3;
		this.oSpan4;
		this.oSpan5;
		working = false;  //计时状态标志
		SetTime = function (obj) {
	 		if (obj.isWorking) {  //任务工作中
				obj.workLeftTime--;  //工作剩余时间减一
				if (obj.workLeftTime < 0) {  //工作剩余时间小于0，即工作结束
		 			if (soundRemind) {
		 				PlaySound(soundMission);
		 			}
			 		clearTimeout(timekeeper);
		 			obj.finishCount++;
		 			obj.oSpan1.innerHTML = obj.finishCount + "/" + obj.count;
		 			obj.restLeftTime = obj.restTime;
		 			obj.isWorking = false;  //任务工作结束，进入任务休息
		 			obj.oSpan2.style.display = "none";
		 			obj.oSpan3.style.display = "none";
		 			obj.oSpan4.style.display = "inline-block";
		 			
		 			// 保存任务状态到localStorage
		 			TaskStorage.updateMission(obj.index, {
		 				finishCount: obj.finishCount,
		 				workLeftTime: obj.workLeftTime,
		 				restLeftTime: obj.restLeftTime,
		 				isWorking: obj.isWorking
		 			});
	 			}
	 		} else {  //任务休息，this.isWorking == false;
				obj.restLeftTime--;  //休息剩余时间减一
		 		if (obj.restLeftTime < 0) {  //休息时间小于0，即休息结束
		 			if (soundRemind) {
		 				PlaySound(soundRest);
		 			}
			 		if (obj.finishCount == obj.count) {  //完成了指定任务次数
			 			clearTimeout(timekeeper);
			 			obj.oSpan2.style.display = "none";
			 			obj.oSpan3.style.display = "none";
			 			obj.oSpan4.style.display = "none";
			 			obj.oSpan5.style.display = "inline-block";
			 			oH1.innerHTML = "Pomodoro Timer";
			 			working = false;  //计时器停止工作
			 			
			 			// 任务完成，保存最终状态
			 			TaskStorage.updateMission(obj.index, {
			 				finishCount: obj.finishCount,
			 				workLeftTime: obj.workLeftTime,
			 				restLeftTime: obj.restLeftTime,
			 				isWorking: obj.isWorking
			 			});
			 			return;
			 		} else {  //尚未完成指定的任务次数，转入下一次工作计时
				 		clearTimeout(timekeeper);
				 		obj.workLeftTime = obj.workTime;  //重置工作时间
				 		obj.isWorking = true;  //任务工作中
				 		obj.oSpan2.style.display = "inline-block";
			 			obj.oSpan3.style.display = "inline-block";
			 			obj.oSpan4.style.display = "none";
			 			this.oSpan2.getElementsByTagName("i")[0].innerHTML = "✅";  //完成按钮
			 			this.oSpan2.nextSibling.getElementsByTagName("i")[0].innerHTML = "⏹️";  //停止按钮
			 			this.oSpan2.nextSibling.className = "span3";
			 			
			 			// 保存任务状态到localStorage
			 			TaskStorage.updateMission(obj.index, {
			 				workLeftTime: obj.workLeftTime,
			 				restLeftTime: obj.restLeftTime,
			 				isWorking: obj.isWorking
			 			});
			 		}
		 		}
	 		}
	 		
	 		// 每10秒保存一次任务进度（避免过于频繁的存储操作）
	 		if ((obj.isWorking ? obj.workTime - obj.workLeftTime : obj.restTime - obj.restLeftTime) % 10 === 0) {
	 			TaskStorage.updateMission(obj.index, {
	 				workLeftTime: obj.workLeftTime,
	 				restLeftTime: obj.restLeftTime,
	 				isWorking: obj.isWorking,
	 				finishCount: obj.finishCount
	 			});
	 		}
	 		
	 		obj.ShowTime();
		 	console.count();
	 		timekeeper = setTimeout(function () {
		 		SetTime(obj);
		 	}, 1000);
	 	}
	}

	Mission.prototype = {
		constructor : Mission,
		GetMissionName : function () {
			return this.missionName;
		},
		GetIndex : function () {
			return this.index;
		},
		SetWorkTime : function () {
			this.endTime.setSeconds(this.workTime);
			this.workLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		},
		SetRestTime : function () {
			this.endTime.setSeconds(this.restTime);
			this.restLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		},
		GetCount : function () {
			return this.count;
		},
		GetWorkTime : function () {
			return this.workTime;
		},
		GetRestTime : function () {
			return this.restTime;
		},
		CreateMissionList : function () {
			var oUl = document.createElement("ul");
			var oLi = document.createElement("li");
			var oSpan1 = document.createElement("span");
			oSpan2 = document.createElement("span");
			oSpan3 = document.createElement("span");
			var oSpan4 = document.createElement("span");
			var oSpan5 = document.createElement("span");
			var oSpan6 = document.createElement("span");
			var oSpan7 = document.createElement("span");
			this.oSpan1 = oSpan1;
			this.oSpan2 = oSpan2;
			this.oSpan3 = oSpan3;
			this.oSpan4 = oSpan4;
			this.oSpan5 = oSpan5;
			this.oSpan6 = oSpan6;
			this.oSpan7 = oSpan7;
			var oStrong = document.createElement("strong");
			var oSpan2A = document.createElement("a");
			var oSpan3A = document.createElement("a");
			var oSpan6A = document.createElement("a");
			var oSpan7A = document.createElement("a");
			var oSpan2I = document.createElement("i");
			var oSpan3I = document.createElement("i");
			var oSpan4I = document.createElement("i");
			var oSpan5I = document.createElement("i");
			var oSpan6I = document.createElement("i");
			var oSpan7I = document.createElement("i");
			var oDiv = document.createElement("div");
			oSpan1.innerHTML = this.finishCount + "/" + this.count;
			
			// 使用任务的实际名称，而不是输入框的值
			oStrong.innerHTML = this.missionName;
			
			oSpan2I.innerHTML = "▶️";
			oSpan3I.innerHTML = "🗑️";
			oSpan4I.innerHTML = "☕ Take a break!";
			oSpan5I.innerHTML = "✅ Task completed!";
			oSpan6I.innerHTML = "☕ Take a break!";
			oSpan7I.innerHTML = "🍅 Continue task!";
			oSpan1.className = "span1";
			oSpan2.className = "span2";
			oSpan4.className = "span4";
			oSpan5.className = "span5";
			oSpan6.className = "span6";
			oSpan7.className = "span7";
			oSpan2A.appendChild(oSpan2I);
			oSpan3A.appendChild(oSpan3I);
			oSpan6A.appendChild(oSpan6I);
			oSpan7A.appendChild(oSpan7I);
			oSpan2.appendChild(oSpan2A);
			oSpan3.appendChild(oSpan3A);
			oSpan4.appendChild(oSpan4I);
			oSpan5.appendChild(oSpan5I);
			oSpan6.appendChild(oSpan6A);
			oSpan7.appendChild(oSpan7A);
			oDiv.appendChild(oSpan1);
			oDiv.appendChild(oSpan2);
			oDiv.appendChild(oSpan3);
			oDiv.appendChild(oSpan4);
			oDiv.appendChild(oSpan5);
			oDiv.appendChild(oSpan6);
			oDiv.appendChild(oSpan7);
			oLi.appendChild(oStrong);
			oLi.appendChild(oDiv);
			oUl.appendChild(oLi);
			oDivMissionList.appendChild(oUl);
			
			// 只在新建任务时清空输入框
			if (typeof oCount !== 'undefined' && typeof oMissionName !== 'undefined' && typeof oAddMission !== 'undefined') {
				oCount.innerHTML = 1;
	   			oMissionName.value = "";
				oAddMission.className = "noClick";
			}
		},
		ShowTime : function () {
			missionWorkTimeM = parseInt(this.workLeftTime / 60);
			missionWorkTimeS = parseInt(this.workLeftTime % 60);
			missionRestTimeM = parseInt(this.restLeftTime / 60);
			missionRestTimeS = parseInt(this.restLeftTime % 60);
		 	oH1 = document.getElementsByTagName("h1")[0];
		 	if (this.isWorking) {
		 		if (missionWorkTimeM < 10 && missionWorkTimeM.toString().length < 2) {
		 			missionWorkTimeM = "0" + missionWorkTimeM;
		 		}
		 		if (missionWorkTimeS < 10 && missionWorkTimeS.toString().length < 2) {
		 			missionWorkTimeS = "0" + missionWorkTimeS;
		 		}
		 		oH1.innerHTML = missionWorkTimeM + "  :  " + missionWorkTimeS;
		 	} else {
		 		if (missionRestTimeM < 10 && missionRestTimeM.toString().length < 2) {
		 			missionRestTimeM = "0" + missionRestTimeM;
		 		}
		 		if (missionRestTimeS < 10 && missionRestTimeS.toString().length < 2) {
		 			missionRestTimeS = "0" + missionRestTimeS;
		 		}
		 		oH1.innerHTML = missionRestTimeM + "  :  " + missionRestTimeS;
		 	}
		 	if (tick) {
		 		PlaySound(soundTick);
		 	}
		},
		EventStart : function () {
			var that = this;
			this.oSpan2.onclick = function () {
				var oParent = this.parentNode.parentNode.parentNode;
				var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
				if (!working) {  //如果不是在工作状态，即按钮显示为开始按钮
					if (this.getElementsByTagName("i")[0].innerHTML == "▶️") {  //开始按钮
						this.getElementsByTagName("i")[0].innerHTML = "✅";  //完成按钮
						SetTime(that);
					}
					this.nextSibling.getElementsByTagName("i")[0].innerHTML = "⏹️";  //停止按钮
					this.nextSibling.className = "span3";
					working = true;  //设置为工作状态
				} else {  //如果正在工作状态，即按钮显示为完成按钮，点击了完成按钮
					console.log("tick is onclick!!!");
					clearTimeout(timekeeper);
					this.getElementsByTagName("i")[0].innerHTML = "▶️";  //开始按钮
					this.nextSibling.getElementsByTagName("i")[0].innerHTML = "🗑️";  //删除按钮
					this.nextSibling.className = "";
					that.workLeftTime = that.workTime;
					that.restLeftTime = that.restTime;
					that.finishCount ++;
					that.oSpan1.innerHTML = that.finishCount + "/" + that.count;
					if (that.finishCount == that.count) {
						if (soundRemind) {
							PlaySound(soundRest);
						}
						that.oSpan2.style.display = "none";
						that.oSpan3.style.display = "none";
						that.oSpan4.style.display = "none";
						that.oSpan5.style.display = "inline-block";
						oH1.innerHTML = "Pomodoro Timer";
					} else {
						that.ShowTime();
					}
					working = false;
				}
			}
		},
		EventStop : function () {
			var that = this;
		 	oSpan3.onclick = function () {
				var oParent = this.parentNode.parentNode.parentNode;
				var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
				if (this.getElementsByTagName("i")[0].innerHTML == "⏹️") {  //停止按钮
					this.className = "";
					this.previousSibling.getElementsByTagName("i")[0].innerHTML = "▶️";
					this.getElementsByTagName("i")[0].innerHTML = "🗑️";  //垃圾桶
					clearTimeout(timekeeper);
					that.workLeftTime = that.workTime;
					that.restLeftTime = that.restTime;
					working = false;
					
					// 更新localStorage中的任务状态
					TaskStorage.updateMission(that.index, {
						workLeftTime: that.workLeftTime,
						restLeftTime: that.restLeftTime,
						isWorking: that.isWorking,
						finishCount: that.finishCount
					});
				} else {  //删除按钮
					// 从localStorage中删除任务
					if (TaskStorage.deleteMission(that.index)) {
						console.log('任务已从本地存储删除');
					} else {
						console.error('任务删除失败');
					}
					
					// 从missionItem数组中移除
					for (var i = 0; i < missionItem.length; i++) {
						if (missionItem[i].index === that.index) {
							missionItem.splice(i, 1);
							break;
						}
					}
					
					oDivMissionList.removeChild(oParent);
					if (oDivMissionList.childNodes.length == 0) {
						oH1.innerHTML = "Pomodoro Timer";
					}
					clearTimeout(timekeeper);
					that.workLeftTime = that.workTime;
					that.restLeftTime = that.restTime;
				}
			}
		},
	}

 	// 任务持久化存储管理器
 	var TaskStorage = {
 		STORAGE_KEY: 'pomodoroTasks',
 		VERSION_KEY: 'pomodoroTasksVersion',
 		CURRENT_VERSION: '1.0.0',
 		
 		// 保存单个任务
 		saveMission: function(mission) {
 			try {
 				var missions = this.loadMissions();
 				var existingIndex = -1;
 				
 				// 手动查找现有任务索引（兼容性更好）
 				for (var i = 0; i < missions.length; i++) {
 					if (missions[i].index === mission.index) {
 						existingIndex = i;
 						break;
 					}
 				}
 				
 				var missionData = {
 					index: mission.index,
 					missionName: mission.missionName,
 					workTime: mission.workTime,
 					restTime: mission.restTime,
 					workTime0: mission.workTime0,
 					restTime0: mission.restTime0,
 					count: mission.count,
 					finishCount: mission.finishCount,
 					isWorking: mission.isWorking,
 					workLeftTime: mission.workLeftTime,
 					restLeftTime: mission.restLeftTime,
 					createdAt: new Date().toISOString(),
 					updatedAt: new Date().toISOString()
 				};
 				
 				if (existingIndex >= 0) {
 					missions[existingIndex] = missionData;
 				} else {
 					missions.push(missionData);
 				}
 				
 				this._saveToStorage(missions);
 				console.log('任务保存成功，当前missions:', missions);
 				return true;
 			} catch (error) {
 				console.error('保存任务失败:', error);
 				return false;
 			}
 		},
 		
 		// 加载所有任务
 		loadMissions: function() {
 			try {
 				var data = localStorage.getItem(this.STORAGE_KEY);
 				if (!data) {
 					return [];
 				}
 				
 				var missions = JSON.parse(data);
 				if (!Array.isArray(missions)) {
 					console.warn('任务数据格式错误，重置为空数组');
 					return [];
 				}
 				
 				return missions;
 			} catch (error) {
 				console.error('加载任务失败:', error);
 				this._handleCorruptedData();
 				return [];
 			}
 		},
 		
 		// 删除任务
 		deleteMission: function(index) {
 			try {
 				var missions = this.loadMissions();
 				var filteredMissions = [];
 				
 				// 手动过滤任务（兼容性更好）
 				for (var i = 0; i < missions.length; i++) {
 					if (missions[i].index !== index) {
 						filteredMissions.push(missions[i]);
 					}
 				}
 				
 				this._saveToStorage(filteredMissions);
 				return true;
 			} catch (error) {
 				console.error('删除任务失败:', error);
 				return false;
 			}
 		},
 		
 		// 更新任务
 		updateMission: function(index, updates) {
 			try {
 				var missions = this.loadMissions();
 				var missionIndex = -1;
 				
 				// 手动查找任务索引（兼容性更好）
 				for (var i = 0; i < missions.length; i++) {
 					if (missions[i].index === index) {
 						missionIndex = i;
 						break;
 					}
 				}
 				
 				if (missionIndex >= 0) {
 					// 手动合并对象（兼容性更好）
 					var updatedMission = {};
 					for (var key in missions[missionIndex]) {
 						updatedMission[key] = missions[missionIndex][key];
 					}
 					for (var key in updates) {
 						updatedMission[key] = updates[key];
 					}
 					updatedMission.updatedAt = new Date().toISOString();
 					
 					missions[missionIndex] = updatedMission;
 					this._saveToStorage(missions);
 					return true;
 				}
 				return false;
 			} catch (error) {
 				console.error('更新任务失败:', error);
 				return false;
 			}
 		},
 		
 		// 清空所有任务
 		clearAllMissions: function() {
 			try {
 				localStorage.removeItem(this.STORAGE_KEY);
 				localStorage.removeItem(this.VERSION_KEY);
 				return true;
 			} catch (error) {
 				console.error('清空任务失败:', error);
 				return false;
 			}
 		},
 		
 		// 获取存储统计信息
 		getStorageStats: function() {
 			try {
 				var missions = this.loadMissions();
 				var dataSize = JSON.stringify(missions).length;
 				var quota = this._getStorageQuota();
 				
 				return {
 					totalMissions: missions.length,
 					dataSize: dataSize,
 					quota: quota,
 					usagePercentage: quota > 0 ? (dataSize / quota * 100).toFixed(2) : 0
 				};
 			} catch (error) {
 				console.error('获取存储统计失败:', error);
 				return null;
 			}
 		},
 		
 		// 私有方法：保存到localStorage
 		_saveToStorage: function(missions) {
 			try {
 				var dataString = JSON.stringify(missions);
 				console.log('准备保存到localStorage:', dataString);
 				
 				// 检查存储配额
 				if (!this._checkStorageQuota(dataString)) {
 					throw new Error('存储空间不足');
 				}
 				
 				localStorage.setItem(this.STORAGE_KEY, dataString);
 				localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
 				
 				// 验证保存是否成功
 				var savedData = localStorage.getItem(this.STORAGE_KEY);
 				console.log('保存后验证localStorage内容:', savedData);
 				
 				if (savedData === dataString) {
 					console.log('数据成功保存到localStorage');
 				} else {
 					console.error('数据保存失败，保存的内容与预期不符');
 				}
 			} catch (error) {
 				console.error('_saveToStorage失败:', error);
 				throw error;
 			}
 		},
 		
 		// 私有方法：检查存储配额
 		_checkStorageQuota: function(dataString) {
 			try {
 				var testKey = 'quota_test_' + Date.now();
 				localStorage.setItem(testKey, dataString);
 				localStorage.removeItem(testKey);
 				return true;
 			} catch (error) {
 				if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
 					console.error('localStorage配额已满');
 					return false;
 				}
 				throw error;
 			}
 		},
 		
 		// 私有方法：获取存储配额
 		_getStorageQuota: function() {
 			try {
 				if (navigator.storage && navigator.storage.estimate) {
 					navigator.storage.estimate().then(function(estimate) {
 						return estimate.quota || 5 * 1024 * 1024; // 默认5MB
 					});
 				}
 				return 5 * 1024 * 1024; // 默认5MB
 			} catch (error) {
 				return 5 * 1024 * 1024; // 默认5MB
 			}
 		},
 		
 		// 私有方法：处理损坏的数据
 		_handleCorruptedData: function() {
 			try {
 				var backup = localStorage.getItem(this.STORAGE_KEY + '_backup');
 				if (backup) {
 					localStorage.setItem(this.STORAGE_KEY, backup);
 					console.log('已从备份恢复数据');
 				} else {
 					localStorage.removeItem(this.STORAGE_KEY);
 					console.log('已清除损坏的数据');
 				}
 			} catch (error) {
 				console.error('数据恢复失败:', error);
 			}
 		}
 	};
 	oAddMissionFootButtonConfirm.onclick = function () {
 		if (oMissionName.value == "") {
		 	oMissionNameValue = oMissionName.placeholder;
		} else {
			oMissionNameValue = oMissionName.value;
		}
		oCountValue = parseInt(oCount.innerHTML);
		
		// 确保时间值是数字类型
		var workTime = parseInt(clockTime);
		var restTime = parseInt(clockSRestTime);
		
 		var newMission = new Mission(missionIndex, oMissionNameValue, workTime, restTime, oCountValue);
 		missionItem.push(newMission);
 		
 		// 保存任务到localStorage
 		if (TaskStorage.saveMission(newMission)) {
 			console.log('任务已保存到本地存储');
 			console.log('保存的任务数据:', newMission);
 		} else {
 			console.error('任务保存失败');
 		}
 		
 		if (!document.getElementById("missionList")) {
	 		oDivMissionList = document.createElement("div");
			oDivMissionList.id = "missionList";
			oPanles[0].appendChild(oDivMissionList);
 		}
 		missionItem[missionIndex].CreateMissionList();
 		missionItem[missionIndex].ShowTime();
 		missionItem[missionIndex].EventStart();
 		missionItem[missionIndex].EventStop();
		missionIndex ++;
 	}
 	
 	// 页面加载时恢复保存的任务
 	function loadSavedMissions() {
 		try {
 			console.log('开始加载保存的任务...');
 			console.log('localStorage内容:', localStorage.getItem('pomodoroTasks'));
 			
 			var savedMissions = TaskStorage.loadMissions();
 			console.log('TaskStorage.loadMissions()返回:', savedMissions);
 			
 			if (savedMissions.length > 0) {
 				console.log('找到', savedMissions.length, '个保存的任务');
 				console.log('任务详情:', savedMissions);
 				
 				// 确保获取正确的容器元素
 				var missionListContainer = document.getElementById("missionList");
 				if (!missionListContainer) {
			 		missionListContainer = document.createElement("div");
					missionListContainer.id = "missionList";
					oPanles[0].appendChild(missionListContainer);
					console.log('创建了新的任务列表容器');
 				} else {
 					console.log('使用现有的任务列表容器');
 				}
 				
 				// 设置全局变量
 				oDivMissionList = missionListContainer;
 				
 				// 恢复每个任务
 				for (var i = 0; i < savedMissions.length; i++) {
 					var savedData = savedMissions[i];
 					console.log('恢复任务', i, ':', savedData);
 					
 					var restoredMission = new Mission(
 						savedData.index,
 						savedData.missionName,
 						savedData.workTime,
 						savedData.restTime,
 						savedData.count
 					);
 					
 					// 恢复任务状态
 					restoredMission.finishCount = savedData.finishCount || 0;
 					restoredMission.isWorking = savedData.isWorking !== undefined ? savedData.isWorking : true;
 					restoredMission.workLeftTime = savedData.workLeftTime !== undefined ? savedData.workLeftTime : savedData.workTime;
 					restoredMission.restLeftTime = savedData.restLeftTime !== undefined ? savedData.restLeftTime : savedData.restTime;
 					
 					console.log('恢复的任务对象:', restoredMission);
 					
 					missionItem.push(restoredMission);
 					restoredMission.CreateMissionList();
 					restoredMission.ShowTime();
 					restoredMission.EventStart();
 					restoredMission.EventStop();
 					
 					// 更新全局索引
 					if (savedData.index >= missionIndex) {
 						missionIndex = savedData.index + 1;
 					}
 				}
 				
 				console.log('成功恢复', savedMissions.length, '个任务');
 			} else {
 				console.log('没有找到保存的任务');
 			}
 		} catch (error) {
 			console.error('恢复任务失败:', error);
 		}
 	}
 	
 	// 在页面加载完成后恢复任务，增加延迟确保DOM完全加载
 	setTimeout(function() {
 		loadSavedMissions();
 	}, 500);
}

// 全局变量声明
var oDivMissionList;
var missionIndex = 0;
var missionItem = new Array();

function getByClassName(parent, child) {
 	var allTag = parent.getElementsByTagName('*');
 	var tarClass = new Array();
 	for (var i = 0; i < allTag.length; i++) {
 		if (allTag[i].className == child) {
 			tarClass.push(allTag[i]);
 		}
 	}
 	return tarClass;
}

function getStyle(obj, attr) {
 	if (obj.currentStyle) {
 		return obj.currentStyle[attr];
 	} else {
 		return getComputedStyle(obj, null)[attr];
 	}
}

function startMove(obj, json, fun) {
 	var finishFlag = true;
 	clearInterval(obj.timer);
 	obj.timer = setInterval(function() {
 		flag = true;
 		var speed = 0,
 		currStyle = null;
 		for (var attr in json) {
 			if (attr == 'opacity') {
 				var isOpacity = true;
 				currStyle = Math.round(parseFloat(getStyle(obj, attr)) * 100);
 			} else {
 				currStyle = parseInt(getStyle(obj, attr));
 			}
 			speed = (json[attr] - currStyle) / 8;
 			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
 			if (currStyle != json[attr]) {
 				finishFlag = false;
 			}
 			if (isOpacity) {
 				obj.style.filter = 'alpha(opacity:' + (currStyle + speed) + ')';
 				obj.style[attr] = (currStyle + speed) / 100;
 			} else {
 				obj.style[attr] = currStyle + speed + 'px';
 			}
 			if (finishFlag) {
 				clearInterval(obj.timer);
 				if (fun) {
 					fun();
 				}
 			}
 		}
 	}, 30);
}

var nightMode = false;
 var nightMode = false;

function loadNightModePreference() {
 	var savedMode = localStorage.getItem('nightMode');
 	if (savedMode === 'true') {
 		nightMode = true;
 		document.body.classList.add('night-mode');
 		updateNightModeIcon();
 	}
}

function saveNightModePreference() {
 	localStorage.setItem('nightMode', nightMode.toString());
}

function toggleNightMode() {
 	nightMode = !nightMode;
 	if (nightMode) {
 		document.body.classList.add('night-mode');
 	} else {
 		document.body.classList.remove('night-mode');
 	}
 	updateNightModeIcon();
 	saveNightModePreference();
}

function updateNightModeIcon() {
 	var toggleBtn = document.getElementById('night-mode-toggle');
 	if (nightMode) {
 		toggleBtn.innerHTML = '☀️';
 		toggleBtn.title = '切换到日间模式';
 	} else {
 		toggleBtn.innerHTML = '🌙';
 		toggleBtn.title = '切换到夜间模式';
 	}
}

function initNightModeToggle() {
 	var toggleBtn = document.getElementById('night-mode-toggle');
 	if (toggleBtn) {
 		toggleBtn.onclick = function(e) {
 			e.preventDefault();
 			toggleNightMode();
 		};
 		updateNightModeIcon();
 	}
}

function initNightMode() {
 	loadNightModePreference();
 	initNightModeToggle();
}

window.addEventListener('load', function() {
 	initNightMode();
});
