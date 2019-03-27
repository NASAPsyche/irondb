FROM postgres:11-alpine

# Add pl/python without rebuilding postgres entirely
# Copied from:
# https://github.com/docker-library/postgres/issues/384#issuecomment-415875299
RUN set -eux; \
	\
	apk add --no-cache --virtual .fetch-deps \
		ca-certificates \
		openssl \
		tar \
	; \
	\
	wget -O postgresql.tar.bz2 "https://ftp.postgresql.org/pub/source/v$PG_VERSION/postgresql-$PG_VERSION.tar.bz2"; \
	echo "$PG_SHA256 *postgresql.tar.bz2" | sha256sum -c -; \
	mkdir -p /usr/src/postgresql; \
	tar \
		--extract \
		--file postgresql.tar.bz2 \
		--directory /usr/src/postgresql \
		--strip-components 1 \
	; \
	rm postgresql.tar.bz2; \
	\
	apk add --no-cache --virtual .build-deps \
		coreutils \
		dpkg-dev dpkg \
		gcc \
		libc-dev \
		libedit-dev \
		make \
		python-dev \
		zlib-dev \
	; \
	\
	cd /usr/src/postgresql; \
	gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"; \
# explicitly update autoconf config.guess and config.sub so they support more arches/libcs
	wget -O config/config.guess 'https://git.savannah.gnu.org/cgit/config.git/plain/config.guess?id=7d3d27baf8107b630586c962c057e22149653deb'; \
	wget -O config/config.sub 'https://git.savannah.gnu.org/cgit/config.git/plain/config.sub?id=7d3d27baf8107b630586c962c057e22149653deb'; \
# configure options taken from:
# https://anonscm.debian.org/cgit/pkg-postgresql/postgresql.git/tree/debian/rules?h=9.5
	./configure \
		--build="$gnuArch" \
		--prefix=/usr/local \
		--with-includes=/usr/local/include \
		--with-libraries=/usr/local/lib \
		--with-python \
	; \
	cd src/pl/plpython; \
	make -j "$(nproc)"; \
	make install; \
	find /usr/local -iname '*plpython*' \
		-exec scanelf --needed --nobanner --format '%n#p' '{}' + \
		| tr ',' '\n' \
		| sort -u \
		| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
		| xargs -rt apk add \
	; \
	apk del .fetch-deps .build-deps; \
	cd /; \
	rm -rf \
		/usr/src/postgresql \
		/usr/local/share/doc \
		/usr/local/share/man \
	; \
	find /usr/local -name '*.a' -delete