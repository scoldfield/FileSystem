package com.cmcc.filesystem.util.pagehelper;

/**
 * @author liuzh
 */
public enum Dialect {
    mysql, mariadb, sqlite, oracle, hsqldb, postgresql, sqlserver, db2, informix;

    public static Dialect of(String dialect) {
        try {
            Dialect d = Dialect.valueOf(dialect);
            return d;
        } catch (IllegalArgumentException e) {
            String dialects = null;
            for (Dialect d : Dialect.values()) {
                if (dialects == null) {
                    dialects = d.toString();
                } else {
                    dialects += "," + d;
                }
            }
            throw new IllegalArgumentException("Mybatis分页插件dialect参数值错误，可选值为[" + dialects + "]");
        }
    }
}

