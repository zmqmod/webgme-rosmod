/* Generated file based on ejs templates */
define([], function() {
    return {
    "CMakeLists.txt.ejs": "cmake_minimum_required(VERSION 2.8.3)\r\nproject(<%= pkgInfo.name %>)\r\n\r\n## Start Global Marker\r\n\r\n## End Global Marker\r\n\r\n## Check C++11 / C++0x\r\ninclude(CheckCXXCompilerFlag)\r\nCHECK_CXX_COMPILER_FLAG(\"-std=c++11\" COMPILER_SUPPORTS_CXX11)\r\nCHECK_CXX_COMPILER_FLAG(\"-std=c++0x\" COMPILER_SUPPORTS_CXX0X)\r\nif(COMPILER_SUPPORTS_CXX11)\r\n    set(CMAKE_CXX_FLAGS \"-std=c++11\")\r\nelseif(COMPILER_SUPPORTS_CXX0X)\r\n    set(CMAKE_CXX_FLAGS \"-std=c++0x\")\r\nelse()\r\n    message(FATAL_ERROR \"The compiler ${CMAKE_CXX_COMPILER} has no C++11 support. Please use a different C++ compiler.\")\r\nendif()\r\n\r\nADD_DEFINITIONS(-DNAMESPACE=${NAMESPACE})\r\nif (${NAMESPACE} STREQUAL \"rosmod\")\r\n  find_package(catkin REQUIRED COMPONENTS rosmod std_msgs message_generation)\r\n  ADD_DEFINITIONS(-DUSE_ROSMOD)\r\nELSEIF(${NAMESPACE} STREQUAL \"ros\")\r\n  find_package(catkin REQUIRED COMPONENTS roscpp std_msgs message_generation)\r\n  ADD_DEFINITIONS(-DUSE_ROSCPP)\r\nELSE()\r\n  message(FATAL_ERROR \"Some error something wrong\")\r\nENDIF()\r\n\r\n## System dependencies are found with CMake's conventions\r\n# find_package(Boost REQUIRED COMPONENTS system)\r\n\r\n\r\n## Uncomment this if the package has a setup.py. This macro ensures\r\n## modules and global scripts declared therein get installed\r\n## See http://ros.org/doc/api/catkin/html/user_guide/setup_dot_py.html\r\n# catkin_python_setup()\r\n\r\n#\r\n## Declare ROS messages, services and actions \r\n#\r\n\r\n## To declare and build messages, services or actions from within this\r\n## package, follow these steps:\r\n## * Let MSG_DEP_SET be the set of packages whose message types you use in\r\n##   your messages/services/actions (e.g. std_msgs, actionlib_msgs, ...).\r\n## * In the file package.xml:\r\n##   * add a build_depend and a run_depend tag for each package in MSG_DEP_SET\r\n##   * If MSG_DEP_SET isn't empty the following dependencies might have been\r\n##     pulled in transitively but can be declared for certainty nonetheless:\r\n##     * add a build_depend tag for \"message_generation\"\r\n##     * add a run_depend tag for \"message_runtime\"\r\n## * In this file (CMakeLists.txt):\r\n##   * add \"message_generation\" and every package in MSG_DEP_SET to\r\n##     find_package(catkin REQUIRED COMPONENTS ...)\r\n##   * add \"message_runtime\" and every package in MSG_DEP_SET to\r\n##     catkin_package(CATKIN_DEPENDS ...)\r\n##   * uncomment the add_*_files sections below as needed\r\n##     and list every .msg/.srv/.action file to be processed\r\n##   * uncomment the generate_messages entry below\r\n##   * add every package in MSG_DEP_SET to generate_messages(DEPENDENCIES ...)\r\n\r\n# Generate messages in the 'msg' folder\r\n\r\n# Generate services in the 'srv' folder\r\nadd_service_files(\r\n  FILES\r\n<%\r\n// All of the services\r\nfor (var srv in pkgInfo.services) {\r\n-%>\r\n <%= pkgInfo.services[srv].name %>.srv\r\n<%\r\n}\r\n-%>\r\n)\r\n\r\n## Generate actions in the 'action' folder\r\n# add_action_files(\r\n#   FILES\r\n#   Action1.action\r\n#   Action2.action\r\n# )\r\n\r\n# Generate added messages and services with any dependencies listed here\r\ngenerate_messages(\r\n  DEPENDENCIES\r\n<%\r\n// All of the messages\r\nfor (var msg in pkgInfo.messages) {\r\n-%>\r\n <%= pkgInfo.messages[msg].name %>.msg\r\n<%\r\n}\r\n-%>\r\n)\r\n\r\n#\r\n## catkin specific configuration \r\n#\r\n## The catkin_package macro generates cmake config files for your package\r\n## Declare things to be passed to dependent projects\r\n## INCLUDE_DIRS: uncomment this if you package contains header files\r\n## LIBRARIES: libraries you create in this project that dependent projects also need\r\n## CATKIN_DEPENDS: catkin_packages dependent projects also need\r\n## DEPENDS: system dependencies of this project that dependent projects also need\r\ncatkin_package(\r\n#  INCLUDE_DIRS include\r\n#  LIBRARIES client_server_package\r\n#  CATKIN_DEPENDS roscpp std_msgs\r\n  CATKIN_DEPENDS message_runtime\r\n#  DEPENDS system_lib\r\n)\r\n\r\n#\r\n## Build \r\n#\r\n\r\n## Specify additional locations of header files\r\n## Your package locations should be listed before other locations\r\n# include_directories(include)\r\ninclude_directories(\r\n  ../node/include\r\n  ${catkin_INCLUDE_DIRS}\r\n<%\r\n// All of the user include directories\r\nfor (var lib in pkgInfo.libraries) {\r\n-%>\r\n <%= pkgInfo.libararies[lib].include %>\r\n<%\r\n}\r\n-%>\r\n)\r\n\r\n## Add folders to be run by python nosetests\r\n# catkin_add_nosetests(test)\r\ninclude_directories(include ${catkin_INCLUDE_DIRS})\r\n\r\n<%\r\n// All of the component libraries\r\n// need to add component's dependent library info\r\nfor (var cmp in pkgInfo.components) {\r\n-%>\r\nadd_library(<%= pkgInfo.components[cmp].name %>\r\n            src/<%= pkgInfo.name%>/<%= pkgInfo.components[cmp].name %>.cpp\r\n            )\r\ntarget_link_libraries(<%= pkgInfo.components[cmp].name %>\r\n                      ${catkin_LIBRARIES} \r\n                      )\r\nadd_dependencies(<%= pkgInfo.components[cmp].name %>\r\n                 <%= pkgInfo.name %>_generate_messages_cpp\r\n\t\t )\r\n<%\r\n}\r\n-%>\r\n",
    "component.cpp.ejs": "#include \"<%= compInfo.packageName %>/<%= compInfo.name %>.hpp\"\r\n\r\n// User Definitions\r\n<%= compInfo.userDefinitions %>\r\n\r\n// Initialization Function\r\nvoid <%= compInfo.name %>::init_timer_operation(const NAMESPACE::TimerEvent& event)\r\n{\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Entering <%= compInfo.name %>::init_timer_operation\");\r\n#endif\r\n  // User Initialization\r\n  <%= compInfo.initialization %>\r\n  // Stop Init Timer\r\n  init_timer.stop();\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Exiting <%= compInfo.name %>::init_timer_operation\");\r\n#endif  \r\n}\r\n\r\n<%\r\nfor (var tmr in compInfo.timers) {\r\n-%>\r\n// Timer Operation - <%= compInfo.timers[tmr].name %>\r\nvoid <%= compInfo.name %>::<%= compInfo.timers[tmr].name %>_operation(const NAMESPACE::TimerEvent& event)\r\n{\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Entering <%= compInfo.name %>::<%= compInfo.timers[tmr].name %>_operation\");\r\n#endif\r\n  <%= compInfo.timers[tmr].operation %>\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Exiting <%= compInfo.name %>::<%= compInfo.timers[tmr].name %>_operation\");\r\n#endif\r\n}\r\n<%\r\n}\r\n-%>\r\n\r\n<%\r\nfor (var sub in compInfo.subscribers) {\r\n-%>\r\n// Subscriber Operation - <%= compInfo.subscribers[sub].name %>\r\nvoid <%= compInfo.name %>::<%= compInfo.subscribers[sub].name %>_operation(const <%= compInfo.subscribers[sub].topic.packageName %>::<%= compInfo.subscribers[sub].topic.name %>::ConstPtr& received_data)\r\n{\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Entering <%= compInfo.name %>::<%= compInfo.subscribers[sub].name %>_operation\");\r\n#endif\r\n  <%= compInfo.subscribers[sub].operation %>\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Exiting <%= compInfo.name %>::<%= compInfo.subscribers[sub].name %>_operation\");\r\n#endif\r\n}\r\n<%\r\n}\r\n-%>\r\n\r\n<%\r\nfor (var srv in compInfo.servers) {\r\n-%>\r\n// Server Operation - <%= compInfo.servers[srv].name %>\r\nvoid <%= compInfo.name %>::<%= compInfo.servers[srv].name %>_operation(const <%= compInfo.servers[srv].service.packageName %>::<%= compInfo.servers[srv].service.name %>::Request &req, <%= compInfo.servers[srv].service.packageName %>::<%= compInfo.servers[srv].service.name %>::Response &res )\r\n{\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Entering <%= compInfo.name %>::<%= compInfo.servers[srv].name %>_operation\");\r\n#endif\r\n  <%= compInfo.servers[srv].operation %>\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->log(\"DEBUG\", \"Exiting <%= compInfo.name %>::<%= compInfo.servers[srv].name %>_operation\");\r\n#endif\r\n}\r\n<%\r\n}\r\n-%>\r\n\r\n\r\n// Destructor - Cleanup Ports & Timers\r\n<%= compInfo.name %>::~<%= compInfo.name %>()\r\n{\r\n<%\r\nfor (var tmr in compInfo.timers){\r\n-%>\r\n  <%= compInfo.timers[tmr].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var pub in compInfo.publishers){\r\n-%>\r\n  <%= compInfo.publishers[pub].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var sub in compInfo.subscribers){\r\n-%>\r\n  <%= compInfo.subscribers[sub].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var clt in compInfo.clients){\r\n-%>\r\n  <%= compInfo.clients[clt].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var srv in compInfo.servers){\r\n-%>\r\n  <%= compInfo.servers[srv].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n  // User Destruction\r\n  <%= compInfo.destruction %>\r\n}\r\n\r\n// Startup - Setup Component Ports & Timers\r\nvoid <%= compInfo.name %>::startUp()\r\n{\r\n  NAMESPACE::NodeHandle nh;\r\n  std::string advertiseName;\r\n\r\n  // Identify the pwd of Node Executable\r\n  std::string s = node_argv[0];\r\n  std::string exec_path = s;\r\n  std::string delimiter = \"/\";\r\n  std::string exec, pwd;\r\n  size_t pos = 0;\r\n  while ((pos = s.find(delimiter)) != std::string::npos) {\r\n    exec = s.substr(0, pos);\r\n    s.erase(0, pos + delimiter.length());\r\n  }\r\n  exec = s.substr(0, pos);\r\n  pwd = exec_path.erase(exec_path.find(exec), exec.length());\r\n  std::string log_file_path = pwd + config.nodeName + \".\" + config.compName + \".log\"; \r\n\r\n  logger->create_file(pwd + config.nodeName + \".\" + config.compName + \".log\");\r\n  logger->set_is_periodic(config.is_periodic_logging);\r\n  logger->set_max_log_unit(config.periodic_log_unit);\r\n\r\n#ifdef USE_ROSMOD\r\n  comp_queue.ROSMOD_LOGGER->create_file(pwd + \"ROSMOD_DEBUG.\" + config.nodeName + \".\" + config.compName + \".log\");\r\n  comp_queue.ROSMOD_LOGGER->set_is_periodic(config.is_periodic_logging);\r\n  comp_queue.ROSMOD_LOGGER->set_max_log_unit(config.periodic_log_unit);\r\n#endif    \r\n  \r\n#ifdef USE_ROSMOD \r\n  this->comp_queue.scheduling_scheme = config.schedulingScheme;\r\n  rosmod::ROSMOD_Callback_Options callback_options;\r\n#endif  \r\n\r\n  // Servers\r\n<%\r\nfor (var srv in compInfo.servers) {\r\n-%>\r\n#ifdef USE_ROSMOD  \r\n  callback_options.alias = \"<%= compInfo.servers[srv].name %>_operation\";\r\n  callback_options.priority = <%= compInfo.servers[srv].priority %>;\r\n  callback_options.deadline.sec =<%= Math.floor(compInfo.servers[srv].deadline) %>;\r\n  callback_options.deadline.nsec = <%= compInfo.servers[srv].deadline % 1 %>;\r\n#endif    \r\n  // Server - <%= compInfo.servers[srv].name %>\r\n  advertiseName = \"<%= compInfo.servers[srv].service.name %>\";\r\n  if (config.portGroupMap.find(\"<%= compInfo.servers[srv].name %>\") != config.portGroupMap.end())\r\n    advertiseName += \"_\" + config.portGroupMap[\"<%= compInfo.servers[srv].name %>\"];\r\n  NAMESPACE::AdvertiseServiceOptions <%= compInfo.servers[srv].name %>_server_options;\r\n  <%= compInfo.servers[srv].name %>_server_options = NAMESPACE::AdvertiseServiceOptions::create<<%= compInfo.servers[srv].service.packageName %>::<%= compInfo.servers[srv].service.name %>>\r\n      (advertiseName.c_str(),\r\n       boost::bind(&Component_2::<%= compInfo.servers[srv].name %>_operation, this, _1, _2),\r\n       NAMESPACE::VoidPtr(),\r\n#ifdef USE_ROSMOD       \r\n       &this->comp_queue,\r\n       callback_options);\r\n#else\r\n       &this->comp_queue);\r\n#endif\r\n  this-><%= compInfo.servers[srv].name %> = nh.advertiseService(<%= compInfo.servers[srv].name %>_server_options);\r\n<%\r\n}\r\n-%>\r\n  // Clients\r\n<%\r\nfor (var clt in compInfo.clients) {\r\n-%>\r\n  // Client - <%= compInfo.clients[clt].name %>\r\n  advertiseName = \"<%= compInfo.clients[clt].service.name %>\";\r\n  if (config.portGroupMap.find(\"<%= compInfo.clients[clt].name %>\") != config.portGroupMap.end())\r\n    advertiseName += \"_\" + config.portGroupMap[\"<%= compInfo.clients[clt].name %>\"];\r\n  this-><%= compInfo.clients[clt].name %> = nh.serviceClient<<%= compInfo.clients[clt].service.packageName %>::<%= compInfo.clients[clt].service.name %>>(advertiseName.c_str(), true); \r\n<%\r\n}\r\n-%>\r\n  // Publishers\r\n<%\r\nfor (var pub in compInfo.publishers) {\r\n-%>\r\n  // Publisher - <%= compInfo.publishers[pub].name %>\r\n  advertiseName = <%= compInfo.publishers[pub].topic.name %>;\r\n  if (config.portGroupMap.find(\"<%= compInfo.publishers[pub].name %>\") != config.portGroupMap.end())\r\n    advertiseName += \"_\" + config.portGroupMap[\"<%= compInfo.publishers[pub].name %>\"];\r\n  this-><%= compInfo.publishers[pub].name %> = nh.advertise<<%= compInfo.publishers[pub].topic.packageName %>::<%= compInfo.publishers[pub].topic.name %>>(advertiseName.c_str(), true); \r\n<%\r\n}\r\n-%>\r\n  // Subscribers\r\n<%\r\nfor (var sub in compInfo.subscribers) {\r\n-%>\r\n  // Subscriber - <%= compInfo.subscribers[sub].name %>\r\n#ifdef USE_ROSMOD \r\n  callback_options.alias = \"<%= compInfo.subscribers[sub].name %>_operation\";\r\n  callback_options.priority = <%= compInfo.subscribers[sub].priority %>;\r\n  callback_options.deadline.sec = <%= Math.floor(compInfo.subscribers[sub].deadline) %>;\r\n  callback_options.deadline.nsec = <%= compInfo.subscribers[sub].deadline % 1 %>;\r\n#endif  \r\n  advertiseName = \"<%= compInfo.subscribers[sub].topic.name %>\";\r\n  if (config.portGroupMap.find(\"<%= compInfo.subscribers[sub].name %>\") != config.portGroupMap.end())\r\n    advertiseName += \"_\" + config.portGroupMap[\"<%= compInfo.subscribers[sub].name %>\"];\r\n  NAMESPACE::SubscribeOptions <%= compInfo.subscribers[sub].name %>_options;\r\n  <%= compInfo.subscribers[sub].name %>_options = NAMESPACE::SubscribeOptions::create<<%= compInfo.subscribers[sub].topic.packageName %>::<%= compInfo.subscribers[sub].topic.name %>>\r\n      (advertiseName.c_str(),\r\n       1000,\r\n       boost::bind(&Component_1::<%= compInfo.subscribers[sub].name %>_operation, this, _1),\r\n       NAMESPACE::VoidPtr(),\r\n#ifdef USE_ROSMOD\r\n       &this->comp_queue,\r\n       callback_options);\r\n#else\r\n       &this->comp_queue);\r\n#endif \r\n  this-><%= compInfo.subscribers[sub].name %> = nh.subscribe(<%= compInfo.subscribers[sub].name %>_options);\r\n<%\r\n}\r\n-%>\r\n\r\n  // Init Timer\r\n#ifdef USE_ROSMOD    \r\n  callback_options.alias = \"init_timer_operation\";\r\n  callback_options.priority = 99;\r\n  callback_options.deadline.sec = 1;\r\n  callback_options.deadline.nsec = 0;\r\n#endif\r\n  NAMESPACE::TimerOptions timer_options;\r\n  timer_options = \r\n    NAMESPACE::TimerOptions\r\n    (ros::Duration(-1),\r\n     boost::bind(&<%= compInfo.name %>::init_timer_operation, this, _1),\r\n     &this->comp_queue,\r\n#ifdef USE_ROSMOD     \r\n     callback_options,\r\n#endif     \r\n     true,\r\n     false); \r\n  this->init_timer = nh.createTimer(timer_options);\r\n  this->init_timer.stop();\r\n\r\n  // Timers\r\n<%\r\nfor (var tmr in compInfo.timers){\r\n-%>\r\n  // Component Timer - <%= compInfo.timers[tmr].name %>\r\n#ifdef USE_ROSMOD   \r\n  callback_options.alias = \"<%= compInfo.timers[tmr].name %>_operation\";\r\n  callback_options.priority = <%= compInfo.timers[tmr].priority %>;\r\n  callback_options.deadline.sec = <%= Math.floor(compInfo.timers[tmr].deadline) %>;\r\n  callback_options.deadline.nsec = <%= compInfo.timers[tmr].priority % 1 %>;\r\n#endif\r\n  timer_options = \r\n    NAMESPACE::TimerOptions\r\n    (ros::Duration(5.0),\r\n     boost::bind(&<%= compInfo.name %>::<%= compInfo.timers[tmr].name %>_operation, this, _1),\r\n     &this->comp_queue,\r\n#ifdef USE_ROSMOD     \r\n     callback_options,\r\n#endif \r\n     false,\r\n     false);\r\n  this-><%= compInfo.timers[tmr].name %> = nh.createTimer(timer_options);\r\n  this-><%= compInfo.timers[tmr].name %>.stop();\r\n<%\r\n}\r\n-%>\r\n\r\n  // Start the timers\r\n  this->init_timer.start();\r\n<%\r\nfor (var tmr in compInfo.timers){\r\n-%>\r\n  this-><%= compInfo.timers[tmr].name %>.start();\r\n<%\r\n}\r\n-%>\r\n}\r\n\r\nextern \"C\" {\r\n  Component *maker(ComponentConfig &config, int argc, char **argv) {\r\n    return new <%= compInfo.name %>(config,argc,argv);\r\n  }\r\n}\r\n\r\n",
    "component.hpp.ejs": "#ifndef CLIENT_HPP\r\n#define CLIENT_HPP\r\n#include \"node/Component.hpp\"\r\n\r\n// Messages required for this component\r\n<%\r\n-%>\r\n<%\r\n-%>\r\n\r\n// Services required for this component\r\n<%\r\n-%>\r\n<%\r\n-%>\r\n\r\n#ifdef USE_ROSMOD\r\n  #include \"rosmod/rosmod_ros.h\"\r\n#else\r\n  #ifdef USE_ROSCPP\r\n    #include \"ros/ros.h\"\r\n  #endif\r\n#endif\r\n\r\n// User Global Forwards\r\n<%= compInfo.forwards %>\r\n\r\nclass <%= compInfo.name %> : public Component\r\n{\r\npublic:\r\n  // Constructor\r\n  <%= compInfo.name %>(ComponentConfig& _config, int argc, char **argv)\r\n  : Component(_config, argc, argv) {}\r\n\r\n  // Initialization\r\n  void init_timer_operation(const NAMESPACE::TimerEvent& event);\r\n\r\n<%\r\nfor (var tmr in compInfo.timers) {\r\n-%>\r\n  // Timer Operation - <%= compInfo.timers[tmr].name %>\r\n  void <%= compInfo.timers[tmr].name %>_operation(const NAMESPACE::TimerEvent& event);\r\n<%\r\n}\r\n-%>\r\n\r\n  // Start up\r\n  void startUp();\r\n\r\n  // Destructor\r\n  ~<%= compInfo.name %>();\r\n\r\nprivate:\r\n\r\n<%\r\nfor (var tmr in compInfo.timers) {\r\n-%>\r\n  NAMESPACE::Timer <%= compInfo.timers[tmr].name %>;\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var svr in compInfo.servers) {\r\n-%>\r\n  NAMESPACE::ServiceServer <%= compInfo.servers[svr].name %>;\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var clt in compInfo.clients) {\r\n -%>\r\n  NAMESPACE::ServiceClient <%= compInfo.clients[clt].name %>;\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var pub in compInfo.publishers) {\r\n -%>\r\n  NAMESPACE::Publisher <%= compInfo.publishers[pub].name %>;\r\n<%\r\n}\r\n-%>\r\n<%\r\nfor (var sub in compInfo.subscribers) {\r\n -%>\r\n  // <%= compInfo.subscribers[sub].name %>\r\n  NAMESPACE::Subscriber <%= compInfo.subscribers[sub].name %>;\r\n<%\r\n}\r\n-%>\r\n\r\n  // User Private Members\r\n  <%= compInfo.members %>\r\n};\r\n\r\n#endif\r\n\r\n"
}});