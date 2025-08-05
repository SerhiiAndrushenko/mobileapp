import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/NotificationsContext';

const img: Record<string, any> = {
  alarm: require('../assets/trivoga.png'),
  poll: require('../assets/oputyvannya.png'),
  appeals: require('../assets/zvernenya.png'),
  transport: require('../assets/transport.png'),
  silence: require('../assets/movchanna.png'),
  repairs: require('../assets/remont.png'),
  achievements: require('../assets/icon_nagradi.png'),
  system: null,
};

export const NotificationsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { visibleItems, clear } = useNotifications();
  const [showAll,setShowAll] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={20} color="#E41B85" style={styles.bellIcon} />
        <Text style={styles.title}>Повідомлення</Text>
        {visibleItems.length > 0 && (
          <TouchableOpacity onPress={clear} style={styles.clearBtn}>
            <Ionicons name="trash" size={18} color="#E41B85" />
          </TouchableOpacity>
        )}
      </View>

      {visibleItems.length === 0 ? (
        <Text style={styles.empty}>Немає повідомлень</Text>
      ) : (
        (showAll? visibleItems: visibleItems.slice(0,5)).map((itm)=>(
          <View key={itm.id} style={styles.itemRow}>
            {img[itm.category] ? (
              <Image source={img[itm.category]} style={styles.rowIcon} />
            ) : (
              <Ionicons name="warning-outline" size={20} color="#E41B85" style={styles.rowIcon}/>
            )}
            <View style={{flex:1}}>
              <Text style={styles.itemTitle}>{itm.title}</Text>
              <Text style={styles.itemText} numberOfLines={2}>{itm.text}</Text>
            </View>
            <Text style={styles.itemTime}>{itm.time}</Text>
          </View>
        ))
      )}
      {visibleItems.length > 5 && !showAll && (
        <TouchableOpacity style={styles.showMoreBtn} activeOpacity={0.7} onPress={()=>setShowAll(true)}>
          <Text style={styles.showMoreText}>Показати ще</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 20,
    marginHorizontal: 16,
    backgroundColor:'#fff',
    borderRadius:24,
    paddingTop:16,
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.05,
    shadowRadius:4,
    elevation:3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:12,
  },
  bellIcon: {
    marginRight: 10,
  },
  clearBtn:{marginLeft:'auto'},
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'e-Ukraine',
  },
  empty:{fontSize:14,color:'#8F8F8F',fontFamily:'e-Ukraine',paddingVertical:14,textAlign:'center'},
  itemRow:{flexDirection:'row',alignItems:'flex-start',gap:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F0F0F0'},
  rowIcon:{width:24,height:24,marginTop:2},
  itemTitle:{fontFamily:'e-Ukraine',fontSize:14,color:'#333',fontWeight:'600'},
  itemText:{fontFamily:'e-Ukraine',fontSize:12,color:'#333',marginTop:2},
  itemTime:{fontFamily:'e-Ukraine',fontSize:12,color:'#8F8F8F'},
  showMoreBtn:{alignItems:'center',paddingVertical:14},
  showMoreText:{fontFamily:'e-Ukraine',fontSize:14,color:'#E41B85',fontWeight:'600'},
 }); 