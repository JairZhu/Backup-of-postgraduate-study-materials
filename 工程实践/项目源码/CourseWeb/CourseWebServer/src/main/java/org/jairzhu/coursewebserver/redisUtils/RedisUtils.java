package org.jairzhu.coursewebserver.redisUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public final class RedisUtils {
    @Autowired
    private StringRedisTemplate redisTemplate;

    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            }
            else {
                redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
            }
        }
    }

    public String get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    public boolean set(String key, String value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void multi() {
        redisTemplate.multi();
    }

    public boolean exec() {
        try {
            redisTemplate.exec();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Set<String> sGet(String key) {
        try {
            return redisTemplate.opsForSet().members(key);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean sHasKey(String key, String value) {
        try {
            return redisTemplate.opsForSet().isMember(key, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public long sSet(String key, String... values) {
        try {
            return redisTemplate.opsForSet().add(key, values);
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public long setRemove(String key, String... values) {
        try {
            return redisTemplate.opsForSet().remove(key, values);
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public boolean zSet(String key, String value, double weight) {
        try {
            return redisTemplate.opsForZSet().add(key, value, weight);
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public long zSetRemove(String key, String... values) {
        try {
            return redisTemplate.opsForZSet().remove(key, values);
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<String> lGet(String key, long start, long end) {
        try {
            return redisTemplate.opsForList().range(key, start, end);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public long lGetListSize(String key) {
        try {
            return redisTemplate.opsForList().size(key);
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public String lGetIndex(String key, long index) {
        try {
            return redisTemplate.opsForList().index(key, index);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean lSet(String key, String value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean lSet(String key, List<String> value) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean lUpdateIndex(String key, long index, String value) {
        try {
            redisTemplate.opsForList().set(key, index, value);
            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public long lRemove(String key, long count, String value) {
        try {
            return redisTemplate.opsForList().remove(key, count, value);
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
